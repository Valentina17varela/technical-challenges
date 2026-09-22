import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type {
  ChargePaymentCommand,
  PaymentPort,
  PaymentResult,
} from '../../application/payments/payment.port.js';

export const MOCK_DECLINED_CARD = '4000000000000002';
export const MOCK_PROVIDER_ERROR_CARD = '4000000000000119';

@Injectable()
export class MockPaymentAdapter implements PaymentPort {
  async charge(command: ChargePaymentCommand): Promise<PaymentResult> {
    if (command.cardNumber === MOCK_PROVIDER_ERROR_CARD) {
      throw new Error('Mock payment provider failed unexpectedly');
    }

    if (command.cardNumber === MOCK_DECLINED_CARD) {
      return { approved: false };
    }

    return {
      approved: true,
      transactionId: `mock_${randomUUID()}`,
    };
  }
}