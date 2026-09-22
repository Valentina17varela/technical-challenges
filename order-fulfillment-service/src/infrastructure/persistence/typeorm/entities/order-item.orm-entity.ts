import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { OrderOrmEntity } from './order.orm-entity.js';
import { ProductOrmEntity } from './product.orm-entity.js';

@Entity({ name: 'order_items' })
@Unique('UQ_order_items_order_product', ['orderId', 'productId'])
@Index('IDX_order_items_order_id', ['orderId'])
@Index('IDX_order_items_product_id', ['productId'])
@Check('CHK_order_items_quantity', 'quantity > 0')
@Check('CHK_order_items_unit_price', 'unit_price >= 0')
export class OrderItemOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ name: 'unit_price', type: 'numeric', precision: 12, scale: 2 })
  unitPrice: string;

  @ManyToOne(() => OrderOrmEntity, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Relation<OrderOrmEntity>;

  @ManyToOne(() => ProductOrmEntity, (product) => product.orderItems)
  @JoinColumn({ name: 'product_id' })
  product: Relation<ProductOrmEntity>;
}