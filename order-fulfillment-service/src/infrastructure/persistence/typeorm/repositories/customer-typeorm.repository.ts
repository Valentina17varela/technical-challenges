import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  CreateCustomer,
  Customer,
  CustomerRepository,
} from '../../../../application/customers/customer.repository.js';
import { CustomerOrmEntity } from '../entities/customer.orm-entity.js';

@Injectable()
export class CustomerTypeOrmRepository implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly customers: Repository<CustomerOrmEntity>,
  ) {}

  async findOrCreate(customer: CreateCustomer): Promise<Customer> {
    await this.customers
      .createQueryBuilder()
      .insert()
      .values({ id: randomUUID(), ...customer })
      .orIgnore()
      .execute();

    return this.customers.findOneByOrFail({ email: customer.email });
  }
}