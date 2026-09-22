import type { OrderStatus } from '../../domain/orders/order-status.js';

export interface CompleteOrderPaymentCommand {
  orderId: string;
  approved: boolean;
  transactionId?: string;
}

export interface OrderPaymentCompletionPort {
  complete(command: CompleteOrderPaymentCommand): Promise<OrderStatus>;
}

export const ORDER_PAYMENT_COMPLETION_PORT = Symbol(
  'OrderPaymentCompletionPort',
);
