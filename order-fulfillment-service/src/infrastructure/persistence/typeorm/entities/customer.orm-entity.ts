import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { OrderOrmEntity } from './order.orm-entity.js';

@Entity({ name: 'customers' })
export class CustomerOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 254, unique: true })
  email: string;

  @OneToMany(() => OrderOrmEntity, (order) => order.customer)
  orders: Relation<OrderOrmEntity[]>;
}