import { ApiProperty } from '@nestjs/swagger';

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

export class CreateOrderResponseDto {
  @ApiProperty({ enum: ['VALIDATED'], example: 'VALIDATED' })
  status: 'VALIDATED';

  @ApiProperty({ type: OrderCustomerResponseDto })
  customer: OrderCustomerResponseDto;

  @ApiProperty({ type: ShippingCoordinatesResponseDto })
  shippingCoordinates: ShippingCoordinatesResponseDto;

  @ApiProperty({ type: SelectedWarehouseResponseDto })
  warehouse: SelectedWarehouseResponseDto;
}