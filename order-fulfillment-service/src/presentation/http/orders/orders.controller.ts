import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PrepareOrderUseCase } from '../../../application/orders/prepare-order.use-case.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { CreateOrderResponseDto } from './dto/create-order-response.dto.js';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly prepareOrder: PrepareOrderUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Validate an order request' })
  @ApiCreatedResponse({
    description:
      'Request validated and customer created or reused. Fulfillment is added in the following implementation phases.',
    type: CreateOrderResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid order request' })
  create(@Body() request: CreateOrderDto): Promise<CreateOrderResponseDto> {
    return this.prepareOrder.execute({ customer: request.customer });
  }
}