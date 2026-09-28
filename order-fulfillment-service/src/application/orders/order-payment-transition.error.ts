export class OrderPaymentTransitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderPaymentTransitionError';
  }
}

export class ReservedInventoryInconsistencyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReservedInventoryInconsistencyError';
  }
}
