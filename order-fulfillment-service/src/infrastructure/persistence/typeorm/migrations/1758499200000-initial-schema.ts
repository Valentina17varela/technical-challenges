import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1758499200000 implements MigrationInterface {
  name = 'InitialSchema1758499200000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "order_status" AS ENUM ('PENDING', 'PAID', 'PAYMENT_FAILED');

      CREATE TABLE "customers" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(150) NOT NULL,
        "email" varchar(254) NOT NULL UNIQUE
      );

      CREATE TABLE "products" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "sku" varchar(50) NOT NULL UNIQUE,
        "name" varchar(150) NOT NULL,
        "price" numeric(12,2) NOT NULL,
        CONSTRAINT "CHK_products_price" CHECK ("price" >= 0)
      );

      CREATE TABLE "warehouses" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(150) NOT NULL,
        "address" varchar(255) NOT NULL,
        "latitude" numeric(9,6) NOT NULL,
        "longitude" numeric(9,6) NOT NULL
      );

      CREATE TABLE "warehouse_inventory" (
        "warehouse_id" uuid NOT NULL REFERENCES "warehouses"("id") ON DELETE CASCADE,
        "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
        "quantity" integer NOT NULL,
        "reserved_quantity" integer NOT NULL DEFAULT 0,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY ("warehouse_id", "product_id"),
        CONSTRAINT "CHK_inventory_quantity" CHECK ("quantity" >= 0),
        CONSTRAINT "CHK_inventory_reserved_quantity"
          CHECK ("reserved_quantity" >= 0 AND "reserved_quantity" <= "quantity")
      );

      CREATE TABLE "orders" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "customer_id" uuid NOT NULL REFERENCES "customers"("id"),
        "warehouse_id" uuid NOT NULL REFERENCES "warehouses"("id"),
        "shipping_address" varchar(500) NOT NULL,
        "shipping_latitude" numeric(9,6) NOT NULL,
        "shipping_longitude" numeric(9,6) NOT NULL,
        "total_amount" numeric(12,2) NOT NULL,
        "status" "order_status" NOT NULL DEFAULT 'PENDING',
        "payment_transaction_id" varchar(100) UNIQUE,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_orders_total_amount" CHECK ("total_amount" >= 0)
      );

      CREATE INDEX "IDX_orders_customer_id" ON "orders" ("customer_id");
      CREATE INDEX "IDX_orders_warehouse_id" ON "orders" ("warehouse_id");

      CREATE TABLE "order_items" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "order_id" uuid NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
        "product_id" uuid NOT NULL REFERENCES "products"("id"),
        "quantity" integer NOT NULL,
        "unit_price" numeric(12,2) NOT NULL,
        CONSTRAINT "UQ_order_items_order_product" UNIQUE ("order_id", "product_id"),
        CONSTRAINT "CHK_order_items_quantity" CHECK ("quantity" > 0),
        CONSTRAINT "CHK_order_items_unit_price" CHECK ("unit_price" >= 0)
      );

      CREATE INDEX "IDX_order_items_order_id" ON "order_items" ("order_id");
      CREATE INDEX "IDX_order_items_product_id" ON "order_items" ("product_id");
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "order_items";
      DROP TABLE IF EXISTS "orders";
      DROP TABLE IF EXISTS "warehouse_inventory";
      DROP TABLE IF EXISTS "warehouses";
      DROP TABLE IF EXISTS "products";
      DROP TABLE IF EXISTS "customers";
      DROP TYPE IF EXISTS "order_status";
    `);
  }
}