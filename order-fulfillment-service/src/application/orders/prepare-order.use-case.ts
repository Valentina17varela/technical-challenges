import type {
  Customer,
  CustomerRepository,
} from '../customers/customer.repository.js';

export interface PrepareOrderCommand {
  customer: {
    name: string;
    email: string;
  };
}

export interface PreparedOrder {
  status: 'VALIDATED';
  customer: Customer;
}

export class PrepareOrderUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(command: PrepareOrderCommand): Promise<PreparedOrder> {
    const customer = await this.customerRepository.findOrCreate({
      name: command.customer.name.trim(),
      email: command.customer.email.trim().toLowerCase(),
    });

    return { status: 'VALIDATED', customer };
  }
}