export interface ChargePaymentCommand {
  cardNumber: string;
  amount: string;
  description: string;
  signal: AbortSignal;
}

export type PaymentResult =
  | { approved: true; transactionId: string }
  | { approved: false };

export interface PaymentPort {
  charge(command: ChargePaymentCommand): Promise<PaymentResult>;
}

export const PAYMENT_PORT = Symbol('PaymentPort');