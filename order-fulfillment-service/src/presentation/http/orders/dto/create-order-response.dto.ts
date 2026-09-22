import { ApiProperty } from '@nestjs/swagger';

export class OrderCustomerResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Valentina Varela' })
  name: string;

  @ApiProperty({ example: 'valentina@example.com' })
  email: string;
}

export class CreateOrderResponseDto {
  @ApiProperty({ enum: ['VALIDATED'], example: 'VALIDATED' })
  status: 'VALIDATED';

  @ApiProperty({ type: OrderCustomerResponseDto })
  customer: OrderCustomerResponseDto;
}