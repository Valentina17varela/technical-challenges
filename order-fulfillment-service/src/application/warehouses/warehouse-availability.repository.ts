import type { Coordinates } from '../../domain/geography/coordinates.js';
import type { ProductRequirement } from '../../domain/orders/product-requirement.js';

export interface AvailableWarehouse {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
}

export interface WarehouseAvailabilityRepository {
  findWithCompleteInventory(
    requirements: ProductRequirement[],
  ): Promise<AvailableWarehouse[]>;
}

export const WAREHOUSE_AVAILABILITY_REPOSITORY = Symbol(
  'WarehouseAvailabilityRepository',
);
