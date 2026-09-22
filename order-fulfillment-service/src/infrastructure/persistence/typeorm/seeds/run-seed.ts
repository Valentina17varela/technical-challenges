import { readFile } from 'node:fs/promises';
import Joi from 'joi';
import dataSource from '../data-source.js';
import { CustomerOrmEntity } from '../entities/customer.orm-entity.js';
import { ProductOrmEntity } from '../entities/product.orm-entity.js';
import { WarehouseInventoryOrmEntity } from '../entities/warehouse-inventory.orm-entity.js';
import { WarehouseOrmEntity } from '../entities/warehouse.orm-entity.js';

interface SeedData {
  customers: Array<{ id: string; name: string; email: string }>;
  products: Array<{ id: string; sku: string; name: string; price: string }>;
  warehouses: Array<{
    id: string;
    name: string;
    address: string;
    latitude: string;
    longitude: string;
  }>;
  inventory: Array<{
    warehouseId: string;
    productId: string;
    quantity: number;
    reservedQuantity: number;
  }>;
}

const uuid = Joi.string().uuid({ version: 'uuidv4' }).required();
const decimal = Joi.string().pattern(/^-?\d+\.\d{2,6}$/).required();
const seedSchema = Joi.object<SeedData>({
  customers: Joi.array().items(
    Joi.object({
      id: uuid,
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    }),
  ),
  products: Joi.array().items(
    Joi.object({
      id: uuid,
      sku: Joi.string().required(),
      name: Joi.string().required(),
      price: decimal,
    }),
  ),
  warehouses: Joi.array().items(
    Joi.object({
      id: uuid,
      name: Joi.string().required(),
      address: Joi.string().required(),
      latitude: decimal,
      longitude: decimal,
    }),
  ),
  inventory: Joi.array().items(
    Joi.object({
      warehouseId: uuid,
      productId: uuid,
      quantity: Joi.number().integer().min(0).required(),
      reservedQuantity: Joi.number()
        .integer()
        .min(0)
        .max(Joi.ref('quantity'))
        .required(),
    }),
  ),
}).required();

async function loadSeedData(): Promise<SeedData> {
  const contents = await readFile(
    new URL('./initial-data.json', import.meta.url),
    'utf8',
  );
  const parsed: unknown = JSON.parse(contents);
  const { error, value } = seedSchema.validate(parsed, { abortEarly: false });

  if (error) {
    throw new Error(`Invalid seed data: ${error.message}`);
  }

  return value;
}

async function seed(): Promise<void> {
  const data = await loadSeedData();
  await dataSource.initialize();

  try {
    await dataSource.transaction(async (manager) => {
      await manager
        .getRepository(CustomerOrmEntity)
        .createQueryBuilder()
        .insert()
        .values(data.customers)
        .orIgnore()
        .execute();
      await manager
        .getRepository(ProductOrmEntity)
        .createQueryBuilder()
        .insert()
        .values(data.products)
        .orIgnore()
        .execute();
      await manager
        .getRepository(WarehouseOrmEntity)
        .createQueryBuilder()
        .insert()
        .values(data.warehouses)
        .orIgnore()
        .execute();
      await manager
        .getRepository(WarehouseInventoryOrmEntity)
        .createQueryBuilder()
        .insert()
        .values(data.inventory)
        .orIgnore()
        .execute();
    });

    console.log(
      'Seed completed. Existing records were preserved.',
    );
  } finally {
    await dataSource.destroy();
  }
}

await seed();