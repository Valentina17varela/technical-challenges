import {
  BadGatewayException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { OrdersService } from '../../../application/orders/orders.service.js';
import { PaymentProviderError } from '../../../application/payments/payment-provider.error.js';
import { NoAvailableWarehouseError } from '../../../application/warehouses/no-available-warehouse.error.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { CreateOrderResponseDto } from './dto/create-order-response.dto.js';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

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
  @ApiBadGatewayResponse({
    description:
      'The payment provider failed. The order was compensated before returning the error.',
    content: {
      'application/json': {
        example: {
          statusCode: 502,
          message: 'Payment provider is temporarily unavailable',
          error: 'Bad Gateway',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected internal error',
    content: {
      'application/json': {
        example: {
          statusCode: 500,
          message: 'Internal server error',
        },
      },
    },
  })
  async create(
    @Body() request: CreateOrderDto,
  ): Promise<CreateOrderResponseDto> {
    try {
      return await this.ordersService.create({
        customer: request.customer,
        shippingAddress: request.shippingAddress,
        items: request.items,
        payment: request.payment,
      });
    } catch (error) {
      if (error instanceof NoAvailableWarehouseError) {
        throw new ConflictException(error.message);
      }

      if (error instanceof PaymentProviderError) {
        throw new BadGatewayException(error.message);
      }

      throw error;
    }
  }
}