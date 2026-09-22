import {
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PrepareOrderUseCase } from '../../../application/orders/prepare-order.use-case.js';
import { NoAvailableWarehouseError } from '../../../application/warehouses/no-available-warehouse.error.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { CreateOrderResponseDto } from './dto/create-order-response.dto.js';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly prepareOrder: PrepareOrderUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create, reserve, and pay an order' })
  @ApiCreatedResponse({
    description:
      'Order created and payment processed at the nearest eligible warehouse.',
    type: CreateOrderResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid order request' })
  @ApiConflictResponse({
    description: 'No warehouse can fulfill the complete order',
  })
  async create(
    @Body() request: CreateOrderDto,
  ): Promise<CreateOrderResponseDto> {
    try {
      return await this.prepareOrder.execute({
        customer: request.customer,
        shippingAddress: request.shippingAddress,
        items: request.items,
        payment: request.payment,
      });
    } catch (error) {
      if (error instanceof NoAvailableWarehouseError) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }
}