import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../../../domain/orders/order-status.js';

export class OrderCustomerResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Valentina Varela' })
  name: string;

  @ApiProperty({ example: 'valentina@example.com' })
  email: string;
}

export class ShippingCoordinatesResponseDto {
  @ApiProperty({ example: 32.7767 })
  latitude: number;

  @ApiProperty({ example: -96.797 })
  longitude: number;
}

export class SelectedWarehouseResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Dallas Central' })
  name: string;

  @ApiProperty({ example: '500 Commerce St, Dallas, TX 75202' })
  address: string;

  @ApiProperty({ type: ShippingCoordinatesResponseDto })
  coordinates: ShippingCoordinatesResponseDto;

  @ApiProperty({ example: 0, description: 'Distance in kilometers' })
  distanceKm: number;
}

export class ReservedOrderItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  productId: string;

  @ApiProperty({ example: 1 })
  quantity: number;

  @ApiProperty({ example: '89.90' })
  unitPrice: string;
}

export class ReservedOrderResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({
    enum: [OrderStatus.Paid, OrderStatus.PaymentFailed],
    example: OrderStatus.Paid,
  })
  status: OrderStatus;

  @ApiProperty({ example: '129.40' })
  totalAmount: string;

  @ApiProperty({ type: [ReservedOrderItemResponseDto] })
  items: ReservedOrderItemResponseDto[];
}

export class CreateOrderResponseDto {
  @ApiProperty({ type: ReservedOrderResponseDto })
  order: ReservedOrderResponseDto;

  @ApiProperty({ type: OrderCustomerResponseDto })
  customer: OrderCustomerResponseDto;

  @ApiProperty({ type: ShippingCoordinatesResponseDto })
  shippingCoordinates: ShippingCoordinatesResponseDto;

  @ApiProperty({ type: SelectedWarehouseResponseDto })
  warehouse: SelectedWarehouseResponseDto;
}