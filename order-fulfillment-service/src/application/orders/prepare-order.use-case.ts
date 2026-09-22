import type {
  Customer,
  CustomerRepository,
} from '../customers/customer.repository.js';
import type {
  Address,
  GeocodingPort,
} from '../geocoding/geocoding.port.js';
import type { Coordinates } from '../../domain/geography/coordinates.js';

export interface PrepareOrderCommand {
  customer: {
    name: string;
    email: string;
  };
  shippingAddress: Address;
}

export interface PreparedOrder {
  status: 'VALIDATED';
  customer: Customer;
  shippingCoordinates: Coordinates;
}

export class PrepareOrderUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly geocoding: GeocodingPort,
  ) {}

  async execute(command: PrepareOrderCommand): Promise<PreparedOrder> {
    const [customer, shippingCoordinates] = await Promise.all([
      this.customerRepository.findOrCreate({
        name: command.customer.name.trim(),
        email: command.customer.email.trim().toLowerCase(),
      }),
      this.geocoding.geocode(command.shippingAddress),
    ]);

    return { status: 'VALIDATED', customer, shippingCoordinates };
  }
}