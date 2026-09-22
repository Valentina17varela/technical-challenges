import { readFile } from 'node:fs/promises';
import Joi from 'joi';
import { DataSource, In } from 'typeorm';
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
const decimal = Joi.string()
  .pattern(/^-?\d+\.\d{2,6}$/)
  .required();
const seedSchema = Joi.object<SeedData>({
  customers: Joi.array()
    .items(
      Joi.object({
        id: uuid,
        name: Joi.string().required(),
        email: Joi.string().email().required(),
      }),
    )
    .required(),
  products: Joi.array()
    .items(
      Joi.object({
        id: uuid,
        sku: Joi.string().required(),
        name: Joi.string().required(),
        price: decimal,
      }),
    )
    .required(),
  warehouses: Joi.array()
    .items(
      Joi.object({
        id: uuid,
        name: Joi.string().required(),
        address: Joi.string().required(),
        latitude: decimal,
        longitude: decimal,
      }),
    )
    .required(),
  inventory: Joi.array()
    .items(
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
    )
    .required(),
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

export async function seedDatabase(dataSource: DataSource): Promise<void> {
  const data = await loadSeedData();

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

    const productsBySku = new Map(
      (
        await manager.getRepository(ProductOrmEntity).findBy({
          sku: In(data.products.map((product) => product.sku)),
        })
      ).map((product) => [product.sku, product.id]),
    );
    const productSkuBySeedId = new Map(
      data.products.map((product) => [product.id, product.sku]),
    );
    const inventory = data.inventory.map((record) => {
      const sku = productSkuBySeedId.get(record.productId);
      const productId = sku ? productsBySku.get(sku) : undefined;

      if (!productId) {
        throw new Error(`Seed product not found: ${record.productId}`);
      }

      return { ...record, productId };
    });

    await manager
      .getRepository(WarehouseInventoryOrmEntity)
      .createQueryBuilder()
      .insert()
      .values(inventory)
      .orIgnore()
      .execute();
  });
}
