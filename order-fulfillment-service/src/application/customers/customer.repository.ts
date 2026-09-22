export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface CreateCustomer {
  name: string;
  email: string;
}

export interface CustomerRepository {
  findOrCreate(customer: CreateCustomer): Promise<Customer>;
}

export const CUSTOMER_REPOSITORY = Symbol('CustomerRepository');