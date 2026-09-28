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
  Matches,
  Max,
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
  @ApiProperty({ example: 'product-1', maxLength: 36 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(36)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  productId: string;

  @ApiProperty({ example: 2, minimum: 1, maximum: 1000 })
  @IsInt()
  @Min(1)
  @Max(1000)
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
