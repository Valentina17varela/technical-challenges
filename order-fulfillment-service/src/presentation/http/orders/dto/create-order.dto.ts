import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsCreditCard,
  IsDefined,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderCustomerDto {
  @ApiProperty({ example: 'Valentina Varela', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({ example: 'valentina@example.com', maxLength: 254 })
  @IsEmail()
  @MaxLength(254)
  email: string;
}

export class ShippingAddressDto {
  @ApiProperty({ example: '500 Commerce St' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  street: string;

  @ApiPropertyOptional({ example: 'Downtown' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  neighborhood?: string;

  @ApiProperty({ example: 'Dallas' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'TX' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  state: string;

  @ApiProperty({ example: '75202' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  postalCode: string;

  @ApiProperty({ example: 'United States' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  country: string;
}

export class OrderItemDto {
  @ApiProperty({ example: '20000000-0000-4000-8000-000000000001' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class OrderPaymentDto {
  @ApiProperty({ example: '4111111111111111', writeOnly: true })
  @IsString()
  @IsCreditCard()
  cardNumber: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: OrderCustomerDto })
  @IsDefined()
  @ValidateNested()
  @Type(() => OrderCustomerDto)
  customer: OrderCustomerDto;

  @ApiProperty({ type: ShippingAddressDto })
  @IsDefined()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @ApiProperty({ type: [OrderItemDto], minItems: 1 })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ type: OrderPaymentDto })
  @IsDefined()
  @ValidateNested()
  @Type(() => OrderPaymentDto)
  payment: OrderPaymentDto;
}