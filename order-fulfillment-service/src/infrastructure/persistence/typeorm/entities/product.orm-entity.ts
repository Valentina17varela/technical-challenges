import {
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { OrderItemOrmEntity } from './order-item.orm-entity.js';
import { WarehouseInventoryOrmEntity } from './warehouse-inventory.orm-entity.js';

@Entity({ name: 'products' })
@Check('CHK_products_price', 'price >= 0')
export class ProductOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  sku: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: string;

  @OneToMany(() => WarehouseInventoryOrmEntity, (inventory) => inventory.product)
  inventory: Relation<WarehouseInventoryOrmEntity[]>;

  @OneToMany(() => OrderItemOrmEntity, (orderItem) => orderItem.product)
  orderItems: Relation<OrderItemOrmEntity[]>;
}