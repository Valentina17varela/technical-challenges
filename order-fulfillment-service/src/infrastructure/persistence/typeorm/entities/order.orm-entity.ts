import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { OrderStatus } from '../../../../domain/orders/order-status.js';
import { CustomerOrmEntity } from './customer.orm-entity.js';
import { OrderItemOrmEntity } from './order-item.orm-entity.js';
import { WarehouseOrmEntity } from './warehouse.orm-entity.js';

@Entity({ name: 'orders' })
@Index('IDX_orders_customer_id', ['customerId'])
@Index('IDX_orders_warehouse_id', ['warehouseId'])
@Check('CHK_orders_total_amount', 'total_amount >= 0')
export class OrderOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @Column({ name: 'warehouse_id', type: 'uuid' })
  warehouseId: string;

  @Column({ name: 'shipping_address', type: 'text' })
  shippingAddress: string;

  @Column({ name: 'shipping_latitude', type: 'numeric', precision: 9, scale: 6 })
  shippingLatitude: string;

  @Column({ name: 'shipping_longitude', type: 'numeric', precision: 9, scale: 6 })
  shippingLongitude: string;

  @Column({ name: 'total_amount', type: 'numeric', precision: 12, scale: 2 })
  totalAmount: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    enumName: 'order_status',
    default: OrderStatus.Pending,
  })
  status: OrderStatus;

  @Column({
    name: 'payment_transaction_id',
    type: 'varchar',
    length: 100,
    nullable: true,
    unique: true,
  })
  paymentTransactionId: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => CustomerOrmEntity, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customer: Relation<CustomerOrmEntity>;

  @ManyToOne(() => WarehouseOrmEntity, (warehouse) => warehouse.orders)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Relation<WarehouseOrmEntity>;

  @OneToMany(() => OrderItemOrmEntity, (orderItem) => orderItem.order)
  items: Relation<OrderItemOrmEntity[]>;
}