import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { OrderOrmEntity } from './order.orm-entity.js';
import { WarehouseInventoryOrmEntity } from './warehouse-inventory.orm-entity.js';

@Entity({ name: 'warehouses' })
export class WarehouseOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'numeric', precision: 9, scale: 6 })
  latitude: string;

  @Column({ type: 'numeric', precision: 9, scale: 6 })
  longitude: string;

  @OneToMany(
    () => WarehouseInventoryOrmEntity,
    (inventory) => inventory.warehouse,
  )
  inventory: Relation<WarehouseInventoryOrmEntity[]>;

  @OneToMany(() => OrderOrmEntity, (order) => order.warehouse)
  orders: Relation<OrderOrmEntity[]>;
}