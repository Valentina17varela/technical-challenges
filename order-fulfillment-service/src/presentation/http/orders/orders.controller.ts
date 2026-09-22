import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { OrdersService } from '../../../application/orders/orders.service.js';
import { ErrorResponseDto } from '../common/error-response.dto.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { CreateOrderResponseDto } from './dto/create-order-response.dto.js';

@ApiTags('orders')
@ApiExtraModels(ErrorResponseDto)
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
  @ApiBadRequestResponse({
    description: 'Invalid order request',
    content: {
      'application/json': {
        schema: { $ref: getSchemaPath(ErrorResponseDto) },
        example: {
          statusCode: 400,
          message: ['items must contain at least 1 elements'],
          error: 'Bad Request',
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'No warehouse can fulfill the complete order',
    content: {
      'application/json': {
        schema: { $ref: getSchemaPath(ErrorResponseDto) },
        example: {
          statusCode: 409,
          message:
            'No warehouse has enough inventory to fulfill the complete order',
          error: 'Conflict',
        },
      },
    },
  })
  @ApiBadGatewayResponse({
    description:
      'The payment provider failed. The order was compensated before returning the error.',
    content: {
      'application/json': {
        schema: { $ref: getSchemaPath(ErrorResponseDto) },
        examples: {
          providerUnavailable: {
            summary: 'Payment provider failure',
            value: {
              statusCode: 502,
              message: 'Payment provider is temporarily unavailable',
              error: 'Bad Gateway',
            },
          },
          providerTimeout: {
            summary: 'Payment provider timeout',
            value: {
              statusCode: 502,
              message: 'Payment provider timed out',
              error: 'Bad Gateway',
            },
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected internal error',
    content: {
      'application/json': {
        schema: { $ref: getSchemaPath(ErrorResponseDto) },
        example: {
          statusCode: 500,
          message: 'Internal server error',
          error: 'Internal Server Error',
        },
      },
    },
  })
  async create(
    @Body() request: CreateOrderDto,
  ): Promise<CreateOrderResponseDto> {
    return this.ordersService.create({
      customer: request.customer,
      shippingAddress: request.shippingAddress,
      items: request.items,
      payment: request.payment,
    });
  }
}