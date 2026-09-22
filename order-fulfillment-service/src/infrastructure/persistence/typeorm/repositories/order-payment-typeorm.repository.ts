import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type {
  CompleteOrderPaymentCommand,
  OrderPaymentRepository,
} from '../../../../application/orders/order-payment.repository.js';
import { OrderStatus } from '../../../../domain/orders/order-status.js';

interface LockedOrderRow {
  status: OrderStatus;
  warehouse_id: string;
}

interface OrderItemQuantityRow {
  product_id: string;
  quantity: number;
}

@Injectable()
export class OrderPaymentTypeOrmRepository implements OrderPaymentRepository {
  constructor(private readonly dataSource: DataSource) {}

  async complete(command: CompleteOrderPaymentCommand): Promise<OrderStatus> {
    return this.dataSource.transaction(async (manager) => {
      const [order] = (await manager.query(
        `
          SELECT status, warehouse_id
          FROM orders
          WHERE id = $1
          FOR UPDATE
        `,
        [command.orderId],
      )) as LockedOrderRow[];

      if (!order || order.status !== OrderStatus.Pending) {
        throw new Error('Only pending orders can complete payment');
      }

      const items = (await manager.query(
        `
          SELECT product_id, quantity
          FROM order_items
          WHERE order_id = $1
          ORDER BY product_id
        `,
        [command.orderId],
      )) as OrderItemQuantityRow[];
      const productIds = items.map((item) => item.product_id);

      await manager.query(
        `
          SELECT product_id
          FROM warehouse_inventory
          WHERE warehouse_id = $1
            AND product_id = ANY($2::uuid[])
          ORDER BY product_id
          FOR UPDATE
        `,
        [order.warehouse_id, productIds],
      );

      const serializedItems = JSON.stringify(items);
      const [{ updated_count: updatedCount }] = (await manager.query(
        `
          WITH updated_inventory AS (
            UPDATE warehouse_inventory inventory
            SET quantity = inventory.quantity -
                  CASE WHEN $1::boolean THEN item.quantity ELSE 0 END,
                reserved_quantity = inventory.reserved_quantity - item.quantity
            FROM jsonb_to_recordset($2::jsonb)
              AS item(product_id uuid, quantity integer)
            WHERE inventory.warehouse_id = $3
              AND inventory.product_id = item.product_id
              AND inventory.reserved_quantity >= item.quantity
              AND (NOT $1::boolean OR inventory.quantity >= item.quantity)
            RETURNING inventory.product_id
          )
          SELECT COUNT(*)::integer AS updated_count
          FROM updated_inventory
        `,
        [command.approved, serializedItems, order.warehouse_id],
      )) as Array<{ updated_count: number }>;

      if (updatedCount !== items.length) {
        throw new Error('Reserved inventory is inconsistent with the order');
      }

      const status = command.approved
        ? OrderStatus.Paid
        : OrderStatus.PaymentFailed;
      const transactionId = command.approved
        ? command.transactionId
        : null;

      if (command.approved && !transactionId) {
        throw new Error('Approved payments require a transaction ID');
      }

      await manager.query(
        `
          UPDATE orders
          SET status = $2,
              payment_transaction_id = $3,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
        `,
        [command.orderId, status, transactionId],
      );

      return status;
    });
  }
}