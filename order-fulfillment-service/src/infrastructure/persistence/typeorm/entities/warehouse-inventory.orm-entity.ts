import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { ProductOrmEntity } from './product.orm-entity.js';
import { WarehouseOrmEntity } from './warehouse.orm-entity.js';

@Entity({ name: 'warehouse_inventory' })
@Index('IDX_warehouse_inventory_product_id', ['productId'])
@Check('CHK_inventory_quantity', 'quantity >= 0')
@Check(
  'CHK_inventory_reserved_quantity',
  'reserved_quantity >= 0 AND reserved_quantity <= quantity',
)
export class WarehouseInventoryOrmEntity {
  @PrimaryColumn({ name: 'warehouse_id', type: 'uuid' })
  warehouseId: string;

  @PrimaryColumn({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ name: 'reserved_quantity', type: 'integer', default: 0 })
  reservedQuantity: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => WarehouseOrmEntity, (warehouse) => warehouse.inventory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Relation<WarehouseOrmEntity>;

  @ManyToOne(() => ProductOrmEntity, (product) => product.inventory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Relation<ProductOrmEntity>;
}
