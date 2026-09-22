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

export class CreateOrderResponseDto {
  @ApiProperty({ enum: ['VALIDATED'], example: 'VALIDATED' })
  status: 'VALIDATED';

  @ApiProperty({ type: OrderCustomerResponseDto })
  customer: OrderCustomerResponseDto;

  @ApiProperty({ type: ShippingCoordinatesResponseDto })
  shippingCoordinates: ShippingCoordinatesResponseDto;
}