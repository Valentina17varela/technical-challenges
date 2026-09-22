export class PaymentProviderError extends Error {
  constructor() {
    super('Payment provider is temporarily unavailable');
    this.name = 'PaymentProviderError';
  }
}