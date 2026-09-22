import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInventoryProductIndex1758499300000 implements MigrationInterface {
  name = 'AddInventoryProductIndex1758499300000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE INDEX "IDX_warehouse_inventory_product_id" ON "warehouse_inventory" ("product_id")',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX "public"."IDX_warehouse_inventory_product_id"',
    );
  }
}
