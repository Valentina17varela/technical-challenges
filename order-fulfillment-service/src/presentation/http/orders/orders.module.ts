import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CUSTOMER_REPOSITORY } from '../../../application/customers/customer.repository.js';
import {
  GEOCODING_PORT,
  type GeocodingPort,
} from '../../../application/geocoding/geocoding.port.js';
import { OrdersService } from '../../../application/orders/orders.service.js';
import {
  ORDER_RESERVATION_REPOSITORY,
  type OrderReservationRepository,
} from '../../../application/orders/order-reservation.repository.js';
import {
  ORDER_PAYMENT_REPOSITORY,
  type OrderPaymentRepository,
} from '../../../application/orders/order-payment.repository.js';
import {
  PAYMENT_PORT,
  type PaymentPort,
} from '../../../application/payments/payment.port.js';
import {
  WAREHOUSE_AVAILABILITY_REPOSITORY,
  type WarehouseAvailabilityRepository,
} from '../../../application/warehouses/warehouse-availability.repository.js';
import { MockGeocodingAdapter } from '../../../infrastructure/geocoding/mock-geocoding.adapter.js';
import { MockPaymentAdapter } from '../../../infrastructure/payments/mock-payment.adapter.js';
import { CustomerOrmEntity } from '../../../infrastructure/persistence/typeorm/entities/customer.orm-entity.js';
import { WarehouseOrmEntity } from '../../../infrastructure/persistence/typeorm/entities/warehouse.orm-entity.js';
import { CustomerTypeOrmRepository } from '../../../infrastructure/persistence/typeorm/repositories/customer-typeorm.repository.js';
import { OrderPaymentTypeOrmRepository } from '../../../infrastructure/persistence/typeorm/repositories/order-payment-typeorm.repository.js';
import { OrderReservationTypeOrmRepository } from '../../../infrastructure/persistence/typeorm/repositories/order-reservation-typeorm.repository.js';
import { WarehouseAvailabilityTypeOrmRepository } from '../../../infrastructure/persistence/typeorm/repositories/warehouse-availability-typeorm.repository.js';
import { OrdersController } from './orders.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerOrmEntity, WarehouseOrmEntity])],
  controllers: [OrdersController],
  providers: [
    CustomerTypeOrmRepository,
    OrderPaymentTypeOrmRepository,
    OrderReservationTypeOrmRepository,
    WarehouseAvailabilityTypeOrmRepository,
    MockGeocodingAdapter,
    MockPaymentAdapter,
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
      provide: PAYMENT_PORT,
      useExisting: MockPaymentAdapter,
    },
    {
      provide: ORDER_PAYMENT_REPOSITORY,
      useExisting: OrderPaymentTypeOrmRepository,
    },
    {
      provide: OrdersService,
      inject: [
        CUSTOMER_REPOSITORY,
        GEOCODING_PORT,
        WAREHOUSE_AVAILABILITY_REPOSITORY,
        ORDER_RESERVATION_REPOSITORY,
        PAYMENT_PORT,
        ORDER_PAYMENT_REPOSITORY,
      ],
      useFactory: (
        customerRepository: CustomerTypeOrmRepository,
        geocoding: GeocodingPort,
        warehouseAvailability: WarehouseAvailabilityRepository,
        orderReservation: OrderReservationRepository,
        payment: PaymentPort,
        orderPayment: OrderPaymentRepository,
      ) =>
        new OrdersService(
          customerRepository,
          geocoding,
          warehouseAvailability,
          orderReservation,
          payment,
          orderPayment,
        ),
    },
  ],
})
export class OrdersModule {}