export class PaymentProviderError extends Error {
  constructor(message = 'Payment provider is temporarily unavailable') {
    super(message);
    this.name = 'PaymentProviderError';
  }
}

export class PaymentTimeoutError extends PaymentProviderError {
  constructor() {
    super('Payment provider timed out');
    this.name = 'PaymentTimeoutError';
  }
}