import type {
  Customer,
  CustomerRepository,
} from '../customers/customer.repository.js';
import type {
  Address,
  GeocodingPort,
} from '../geocoding/geocoding.port.js';
import type { Coordinates } from '../../domain/geography/coordinates.js';
import { calculateHaversineDistanceKm } from '../../domain/geography/haversine-distance.js';
import { NoAvailableWarehouseError } from '../warehouses/no-available-warehouse.error.js';
import type {
  AvailableWarehouse,
  ProductRequirement,
  WarehouseAvailabilityRepository,
} from '../warehouses/warehouse-availability.repository.js';

export interface PrepareOrderCommand {
  customer: {
    name: string;
    email: string;
  };
  shippingAddress: Address;
  items: ProductRequirement[];
}

export interface SelectedWarehouse extends AvailableWarehouse {
  distanceKm: number;
}

export interface PreparedOrder {
  status: 'VALIDATED';
  customer: Customer;
  shippingCoordinates: Coordinates;
  warehouse: SelectedWarehouse;
}

export class PrepareOrderUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly geocoding: GeocodingPort,
    private readonly warehouseAvailability: WarehouseAvailabilityRepository,
  ) {}

  async execute(command: PrepareOrderCommand): Promise<PreparedOrder> {
    const requirements = this.consolidateItems(command.items);
    const [customer, shippingCoordinates] = await Promise.all([
      this.customerRepository.findOrCreate({
        name: command.customer.name.trim(),
        email: command.customer.email.trim().toLowerCase(),
      }),
      this.geocoding.geocode(command.shippingAddress),
    ]);

    const candidates =
      await this.warehouseAvailability.findWithCompleteInventory(requirements);
    const warehouse = this.selectNearestWarehouse(
      candidates,
      shippingCoordinates,
    );

    return { status: 'VALIDATED', customer, shippingCoordinates, warehouse };
  }

  private consolidateItems(items: ProductRequirement[]): ProductRequirement[] {
    const quantities = new Map<string, number>();

    for (const item of items) {
      quantities.set(
        item.productId,
        (quantities.get(item.productId) ?? 0) + item.quantity,
      );
    }

    return [...quantities].map(([productId, quantity]) => ({
      productId,
      quantity,
    }));
  }

  private selectNearestWarehouse(
    warehouses: AvailableWarehouse[],
    destination: Coordinates,
  ): SelectedWarehouse {
    const [nearest] = warehouses
      .map((warehouse) => ({
        ...warehouse,
        distanceKm: calculateHaversineDistanceKm(
          destination,
          warehouse.coordinates,
        ),
      }))
      .sort(
        (left, right) =>
          left.distanceKm - right.distanceKm ||
          left.id.localeCompare(right.id),
      );

    if (!nearest) {
      throw new NoAvailableWarehouseError();
    }

    return nearest;
  }
}