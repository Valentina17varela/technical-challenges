import type { Address } from '../geocoding/geocoding.port.js';
import type { Coordinates } from '../../domain/geography/coordinates.js';
import type { OrderStatus } from '../../domain/orders/order-status.js';
import type { ProductRequirement } from '../warehouses/warehouse-availability.repository.js';

export interface ReserveOrderCommand {
  customerId: string;
  warehouseId: string;
  shippingAddress: Address;
  shippingCoordinates: Coordinates;
  requirements: ProductRequirement[];
}

export interface ReservedOrderItem {
  productId: string;
  quantity: number;
  unitPrice: string;
}

export interface ReservedOrder {
  id: string;
  status: OrderStatus;
  totalAmount: string;
  items: ReservedOrderItem[];
}

export interface OrderReservationRepository {
  reserve(command: ReserveOrderCommand): Promise<ReservedOrder>;
}

export const ORDER_RESERVATION_REPOSITORY = Symbol(
  'OrderReservationRepository',
);