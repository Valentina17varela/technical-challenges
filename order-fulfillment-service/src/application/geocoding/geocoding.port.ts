import type { Coordinates } from '../../domain/geography/coordinates.js';

export interface Address {
  street: string;
  neighborhood?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface GeocodingPort {
  geocode(address: Address): Promise<Coordinates>;
}

export const GEOCODING_PORT = Symbol('GeocodingPort');