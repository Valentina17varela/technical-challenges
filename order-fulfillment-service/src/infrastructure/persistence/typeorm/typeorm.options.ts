import type { DataSourceOptions } from 'typeorm';
import { CustomerOrmEntity } from './entities/customer.orm-entity.js';
import { OrderItemOrmEntity } from './entities/order-item.orm-entity.js';
import { OrderOrmEntity } from './entities/order.orm-entity.js';
import { ProductOrmEntity } from './entities/product.orm-entity.js';
import { WarehouseInventoryOrmEntity } from './entities/warehouse-inventory.orm-entity.js';
import { WarehouseOrmEntity } from './entities/warehouse.orm-entity.js';
import { InitialSchema1758499200000 } from './migrations/1758499200000-initial-schema.js';
import { AddInventoryProductIndex1758499300000 } from './migrations/1758499300000-add-inventory-product-index.js';

export interface DatabaseSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export function createTypeOrmOptions(
  settings: DatabaseSettings,
): DataSourceOptions {
  return {
    type: 'postgres',
    ...settings,
    entities: [
      CustomerOrmEntity,
      ProductOrmEntity,
      WarehouseOrmEntity,
      WarehouseInventoryOrmEntity,
      OrderOrmEntity,
      OrderItemOrmEntity,
    ],
    migrations: [
      InitialSchema1758499200000,
      AddInventoryProductIndex1758499300000,
    ],
    migrationsTableName: 'migrations',
    migrationsRun: false,
    synchronize: false,
  };
}
