import { createHash } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type {
  Address,
  GeocodingPort,
} from '../../application/geocoding/geocoding.port.js';
import type { Coordinates } from '../../domain/geography/coordinates.js';

const CONTIGUOUS_US_BOUNDS = {
  minimumLatitude: 24.396308,
  maximumLatitude: 49.384358,
  minimumLongitude: -124.848974,
  maximumLongitude: -66.885444,
};

const MOCK_COORDINATES_BY_LOCATION = new Map<string, Coordinates>([
  ['dallas|tx|75202|united states', { latitude: 32.7767, longitude: -96.797 }],
  ['austin|tx|78701|united states', { latitude: 30.2672, longitude: -97.7431 }],
  ['houston|tx|77002|united states', { latitude: 29.7604, longitude: -95.3698 }],
]);

function normalizeAddress(address: Address): string {
  return [
    address.street,
    address.neighborhood ?? '',
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ]
    .map((part) => part.trim().toLowerCase())
    .join('|');
}

function interpolate(value: number, minimum: number, maximum: number): number {
  return minimum + (value / 0xffffffff) * (maximum - minimum);
}

@Injectable()
export class MockGeocodingAdapter implements GeocodingPort {
  async geocode(address: Address): Promise<Coordinates> {
    const locationKey = [
      address.city,
      address.state,
      address.postalCode,
      address.country,
    ]
      .map((part) => part.trim().toLowerCase())
      .join('|');
    const coordinates = MOCK_COORDINATES_BY_LOCATION.get(locationKey);

    if (coordinates) {
      return coordinates;
    }

    const hash = createHash('sha256')
      .update(normalizeAddress(address))
      .digest();

    return {
      latitude: Number(
        interpolate(
          hash.readUInt32BE(0),
          CONTIGUOUS_US_BOUNDS.minimumLatitude,
          CONTIGUOUS_US_BOUNDS.maximumLatitude,
        ).toFixed(6),
      ),
      longitude: Number(
        interpolate(
          hash.readUInt32BE(4),
          CONTIGUOUS_US_BOUNDS.minimumLongitude,
          CONTIGUOUS_US_BOUNDS.maximumLongitude,
        ).toFixed(6),
      ),
    };
  }
}