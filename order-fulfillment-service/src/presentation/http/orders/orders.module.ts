import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CUSTOMER_REPOSITORY } from '../../../application/customers/customer.repository.js';
import {
  GEOCODING_PORT,
  type GeocodingPort,
} from '../../../application/geocoding/geocoding.port.js';
import { PrepareOrderUseCase } from '../../../application/orders/prepare-order.use-case.js';
import {
  ORDER_RESERVATION_REPOSITORY,
  type OrderReservationRepository,
} from '../../../application/orders/order-reservation.repository.js';
import {
  WAREHOUSE_AVAILABILITY_REPOSITORY,
  type WarehouseAvailabilityRepository,
} from '../../../application/warehouses/warehouse-availability.repository.js';
import { MockGeocodingAdapter } from '../../../infrastructure/geocoding/mock-geocoding.adapter.js';
import { CustomerOrmEntity } from '../../../infrastructure/persistence/typeorm/entities/customer.orm-entity.js';
import { WarehouseOrmEntity } from '../../../infrastructure/persistence/typeorm/entities/warehouse.orm-entity.js';
import { CustomerTypeOrmRepository } from '../../../infrastructure/persistence/typeorm/repositories/customer-typeorm.repository.js';
import { OrderReservationTypeOrmRepository } from '../../../infrastructure/persistence/typeorm/repositories/order-reservation-typeorm.repository.js';
import { WarehouseAvailabilityTypeOrmRepository } from '../../../infrastructure/persistence/typeorm/repositories/warehouse-availability-typeorm.repository.js';
import { OrdersController } from './orders.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerOrmEntity, WarehouseOrmEntity])],
  controllers: [OrdersController],
  providers: [
    CustomerTypeOrmRepository,
    OrderReservationTypeOrmRepository,
    WarehouseAvailabilityTypeOrmRepository,
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
      provide: WAREHOUSE_AVAILABILITY_REPOSITORY,
      useExisting: WarehouseAvailabilityTypeOrmRepository,
    },
    {
      provide: ORDER_RESERVATION_REPOSITORY,
      useExisting: OrderReservationTypeOrmRepository,
    },
    {
      provide: PrepareOrderUseCase,
      inject: [
        CUSTOMER_REPOSITORY,
        GEOCODING_PORT,
        WAREHOUSE_AVAILABILITY_REPOSITORY,
        ORDER_RESERVATION_REPOSITORY,
      ],
      useFactory: (
        customerRepository: CustomerTypeOrmRepository,
        geocoding: GeocodingPort,
        warehouseAvailability: WarehouseAvailabilityRepository,
        orderReservation: OrderReservationRepository,
      ) =>
        new PrepareOrderUseCase(
          customerRepository,
          geocoding,
          warehouseAvailability,
          orderReservation,
        ),
    },
  ],
})
export class OrdersModule {}