import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CUSTOMER_REPOSITORY } from '../../../application/customers/customer.repository.js';
import { PrepareOrderUseCase } from '../../../application/orders/prepare-order.use-case.js';
import { CustomerOrmEntity } from '../../../infrastructure/persistence/typeorm/entities/customer.orm-entity.js';
import { CustomerTypeOrmRepository } from '../../../infrastructure/persistence/typeorm/repositories/customer-typeorm.repository.js';
import { OrdersController } from './orders.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerOrmEntity])],
  controllers: [OrdersController],
  providers: [
    CustomerTypeOrmRepository,
    {
      provide: CUSTOMER_REPOSITORY,
      useExisting: CustomerTypeOrmRepository,
    },
    {
      provide: PrepareOrderUseCase,
      inject: [CUSTOMER_REPOSITORY],
      useFactory: (customerRepository: CustomerTypeOrmRepository) =>
        new PrepareOrderUseCase(customerRepository),
    },
  ],
})
export class OrdersModule {}