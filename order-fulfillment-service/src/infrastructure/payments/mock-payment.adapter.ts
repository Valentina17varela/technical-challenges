import { randomUUID } from 'node:crypto';
import { setTimeout } from 'node:timers/promises';
import { Injectable } from '@nestjs/common';
import type {
  ChargePaymentCommand,
  PaymentPort,
  PaymentResult,
} from '../../application/payments/payment.port.js';
import { PaymentProviderError } from '../../application/payments/payment-provider.error.js';

export const MOCK_DECLINED_CARD = '4000000000000002';
export const MOCK_PROVIDER_ERROR_CARD = '4000000000000119';
export const MOCK_TIMEOUT_CARD = '4000000000000259';

@Injectable()
export class MockPaymentAdapter implements PaymentPort {
  async charge(command: ChargePaymentCommand): Promise<PaymentResult> {
    if (command.cardNumber === MOCK_PROVIDER_ERROR_CARD) {
      throw new PaymentProviderError();
    }

    if (command.cardNumber === MOCK_TIMEOUT_CARD) {
      await setTimeout(60_000, undefined, { signal: command.signal });
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