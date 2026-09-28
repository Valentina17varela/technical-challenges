export class NoAvailableWarehouseError extends Error {
  constructor() {
    super('No warehouse has enough inventory to fulfill the complete order');
    this.name = 'NoAvailableWarehouseError';
  }
}