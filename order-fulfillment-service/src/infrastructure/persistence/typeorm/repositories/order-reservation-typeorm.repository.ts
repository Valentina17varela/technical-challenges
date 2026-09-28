import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type {
  OrderReservationRepository,
  ReservedOrder,
  ReserveOrderCommand,
} from '../../../../application/orders/order-reservation.repository.js';
import { NoAvailableWarehouseError } from '../../../../application/warehouses/no-available-warehouse.error.js';
import { OrderStatus } from '../../../../domain/orders/order-status.js';

interface LockedInventoryRow {
  product_id: string;
  quantity: number;
  reserved_quantity: number;
  price: string;
}

interface CreatedOrderRow {
  id: string;
  status: OrderStatus;
  total_amount: string;
}

@Injectable()
export class OrderReservationTypeOrmRepository implements OrderReservationRepository {
  constructor(private readonly dataSource: DataSource) {}

  async reserve(command: ReserveOrderCommand): Promise<ReservedOrder> {
    const requirements = [...command.requirements].sort((left, right) =>
      left.productId < right.productId
        ? -1
        : left.productId > right.productId
          ? 1
          : 0,
    );
    const serializedRequirements = JSON.stringify(
      requirements.map((requirement) => ({
        product_id: requirement.productId,
        quantity: requirement.quantity,
      })),
    );

    return this.dataSource.transaction(async (manager) => {
      const inventory = (await manager.query(
        `
          SELECT inventory.product_id,
                 inventory.quantity,
                 inventory.reserved_quantity,
                 product.price
          FROM warehouse_inventory inventory
          INNER JOIN products product ON product.id = inventory.product_id
          WHERE inventory.warehouse_id = $1
            AND inventory.product_id = ANY($2::varchar[])
          ORDER BY inventory.product_id
          FOR UPDATE OF inventory, product
        `,
        [command.warehouseId, requirements.map((item) => item.productId)],
      )) as LockedInventoryRow[];

      const inventoryByProduct = new Map(
        inventory.map((row) => [row.product_id, row]),
      );
      const canReserve = requirements.every((requirement) => {
        const row = inventoryByProduct.get(requirement.productId);
        return (
          row !== undefined &&
          row.quantity - row.reserved_quantity >= requirement.quantity
        );
      });

      if (!canReserve) {
        throw new NoAvailableWarehouseError();
      }

      const [{ total_amount: totalAmount }] = (await manager.query(
        `
          SELECT SUM(product.price * requirement.quantity)::numeric(12, 2)
            AS total_amount
          FROM jsonb_to_recordset($1::jsonb)
            AS requirement(product_id varchar, quantity integer)
          INNER JOIN products product ON product.id = requirement.product_id
        `,
        [serializedRequirements],
      )) as Array<{ total_amount: string }>;

      const shippingAddress = JSON.stringify({
        street: command.shippingAddress.street,
        neighborhood: command.shippingAddress.neighborhood ?? null,
        city: command.shippingAddress.city,
        state: command.shippingAddress.state,
        postalCode: command.shippingAddress.postalCode,
        country: command.shippingAddress.country,
      });
      const [order] = (await manager.query(
        `
          INSERT INTO orders (
            customer_id,
            warehouse_id,
            shipping_address,
            shipping_latitude,
            shipping_longitude,
            total_amount,
            status
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id, status, total_amount
        `,
        [
          command.customerId,
          command.warehouseId,
          shippingAddress,
          command.shippingCoordinates.latitude,
          command.shippingCoordinates.longitude,
          totalAmount,
          OrderStatus.Pending,
        ],
      )) as CreatedOrderRow[];

      await manager.query(
        `
          INSERT INTO order_items (order_id, product_id, quantity, unit_price)
          SELECT $1, requirement.product_id, requirement.quantity, product.price
          FROM jsonb_to_recordset($2::jsonb)
            AS requirement(product_id varchar, quantity integer)
          INNER JOIN products product ON product.id = requirement.product_id
        `,
        [order.id, serializedRequirements],
      );

      await manager.query(
        `
          UPDATE warehouse_inventory inventory
          SET reserved_quantity = inventory.reserved_quantity + requirement.quantity
          FROM jsonb_to_recordset($1::jsonb)
            AS requirement(product_id varchar, quantity integer)
          WHERE inventory.warehouse_id = $2
            AND inventory.product_id = requirement.product_id
        `,
        [serializedRequirements, command.warehouseId],
      );

      return {
        id: order.id,
        status: order.status,
        totalAmount: order.total_amount,
        paymentTransactionId: null,
        items: requirements.map((requirement) => ({
          ...requirement,
          unitPrice: inventoryByProduct.get(requirement.productId)!.price,
        })),
      };
    });
  }
}
