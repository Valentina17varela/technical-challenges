import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CUSTOMER_REPOSITORY } from '../../../application/customers/customer.repository.js';
import {
  GEOCODING_PORT,
  type GeocodingPort,
} from '../../../application/geocoding/geocoding.port.js';
import { PrepareOrderUseCase } from '../../../application/orders/prepare-order.use-case.js';
import { MockGeocodingAdapter } from '../../../infrastructure/geocoding/mock-geocoding.adapter.js';
import { CustomerOrmEntity } from '../../../infrastructure/persistence/typeorm/entities/customer.orm-entity.js';
import { CustomerTypeOrmRepository } from '../../../infrastructure/persistence/typeorm/repositories/customer-typeorm.repository.js';
import { OrdersController } from './orders.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerOrmEntity])],
  controllers: [OrdersController],
  providers: [
    CustomerTypeOrmRepository,
    MockGeocodingAdapter,
    {
      provide: CUSTOMER_REPOSITORY,
      useExisting: CustomerTypeOrmRepository,
    },
    {
      provide: GEOCODING_PORT,
      useExisting: MockGeocodingAdapter,
    },
    {
      provide: PrepareOrderUseCase,
      inject: [CUSTOMER_REPOSITORY, GEOCODING_PORT],
      useFactory: (
        customerRepository: CustomerTypeOrmRepository,
        geocoding: GeocodingPort,
      ) => new PrepareOrderUseCase(customerRepository, geocoding),
    },
  ],
})
export class OrdersModule {}