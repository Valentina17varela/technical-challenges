import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  AvailableWarehouse,
  ProductRequirement,
  WarehouseAvailabilityRepository,
} from '../../../../application/warehouses/warehouse-availability.repository.js';
import { WarehouseOrmEntity } from '../entities/warehouse.orm-entity.js';

interface WarehouseRow {
  id: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
}

@Injectable()
export class WarehouseAvailabilityTypeOrmRepository
  implements WarehouseAvailabilityRepository
{
  constructor(
    @InjectRepository(WarehouseOrmEntity)
    private readonly warehouses: Repository<WarehouseOrmEntity>,
  ) {}

  async findWithCompleteInventory(
    requirements: ProductRequirement[],
  ): Promise<AvailableWarehouse[]> {
    const rows = (await this.warehouses.query(
      `
        WITH requirements AS (
          SELECT *
          FROM jsonb_to_recordset($1::jsonb)
            AS requirement(product_id uuid, required_quantity integer)
        )
        SELECT warehouse.id,
               warehouse.name,
               warehouse.address,
               warehouse.latitude,
               warehouse.longitude
        FROM warehouses warehouse
        INNER JOIN warehouse_inventory inventory
          ON inventory.warehouse_id = warehouse.id
        INNER JOIN requirements requirement
          ON requirement.product_id = inventory.product_id
        WHERE inventory.quantity - inventory.reserved_quantity
          >= requirement.required_quantity
        GROUP BY warehouse.id
        HAVING COUNT(DISTINCT inventory.product_id) =
          (SELECT COUNT(*) FROM requirements)
      `,
      [
        JSON.stringify(
          requirements.map((requirement) => ({
            product_id: requirement.productId,
            required_quantity: requirement.quantity,
          })),
        ),
      ],
    )) as WarehouseRow[];

    return rows.map((warehouse) => ({
      id: warehouse.id,
      name: warehouse.name,
      address: warehouse.address,
      coordinates: {
        latitude: Number(warehouse.latitude),
        longitude: Number(warehouse.longitude),
      },
    }));
  }
}