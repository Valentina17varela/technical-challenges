# Order Fulfillment Service

![](https://img.shields.io/badge/Code-NodeJS-informational?style=flat&logo=Node.js&logoColor=white&color=blue)
![](https://img.shields.io/badge/Framework-nestjs-informational?style=flat&logo=nestjs&logoColor=white&color=blue)

Backend Engineer Technical Challenge

## 🛠️ Requirements

Backend service for an e-commerce platform, web server with a minimal order management API

- POST /orders to create an order, which will be called by the UI as customers place orders.
- Orders have a customer, a shipping address, and a list of items (products and quantities).
- An order must be filled from a single warehouse, so you need to find a warehouse that has all the requested products. If multiple warehouses fit, you should pick the one closest to the shipping address.
- For converting an address to latitude/longitude, usually we’d use a 3rd party geocoding api. You can mock that.
- On creating the order, it should call an external payment API, which you can mock. The payments API takes as input a credit card number, amount, and description (we know in the real world we wouldn’t want to have people’s credit card numbers and the payment integration would be more complicated than a simple API request, but let’s imagine that it’s that simple).

## 1. Use case: approved payment at the nearest warehouse

This case demonstrates customer creation, explicit Dallas geocoding, nearest-warehouse selection, database prices, payment approval, stock deduction, and a persisted payment reference.

```json
{
  "customer": {
    "name": "Video Approved Customer",
    "email": "video.approved@example.com"
  },
  "shippingAddress": {
    "street": "500 Commerce St",
    "city": "Dallas",
    "state": "TX",
    "postalCode": "75202",
    "country": "United States"
  },
  "items": [
    {
      "productId": "20000000-0000-4000-8000-000000000001",
      "quantity": 2
    },
    {
      "productId": "20000000-0000-4000-8000-000000000002",
      "quantity": 1
    }
  ],
  "payment": {
    "cardNumber": "4111111111111111"
  }
}
```

Expected HTTP result:

- Status: `201 Created`.
- `order.status`: `PAID`.
- `order.totalAmount`: `219.30`.
- `order.paymentTransactionId`: starts with `mock_`.
- `warehouse.name`: `Dallas Central`.
- `warehouse.distanceKm`: `0`.
- The response does not contain the card number.

Expected database result:

- One customer and one `PAID` order exist for `video.approved@example.com`.
- The database transaction ID matches the API response.
- The order contains keyboard quantity `2` at `89.90` and mouse quantity `1` at `39.50`.
- Dallas keyboard stock is `18`; Dallas mouse stock is `29`.
- Both Dallas reservations are `0` because approval committed the physical deduction.

## 2. Use case: declined payment with compensation

This case demonstrates a valid request and reservation followed by a declined payment. Physical stock must remain unchanged.

```json
{
  "customer": {
    "name": "Video Declined Customer",
    "email": "video.declined@example.com"
  },
  "shippingAddress": {
    "street": "1100 Congress Ave",
    "city": "Austin",
    "state": "TX",
    "postalCode": "78701",
    "country": "United States"
  },
  "items": [
    {
      "productId": "20000000-0000-4000-8000-000000000004",
      "quantity": 1
    }
  ],
  "payment": {
    "cardNumber": "4000000000000002"
  }
}
```

Expected HTTP result:

- Status: `201 Created`.
- `order.status`: `PAYMENT_FAILED`.
- `order.totalAmount`: `64.75`.
- `order.paymentTransactionId`: `null`.
- `warehouse.name`: `Austin Central`.

Expected database result:

- The customer and failed order remain available for audit.
- Austin headset stock remains `12`.
- Austin headset `reserved_quantity` returns to `0`.
- No payment transaction ID is persisted.

## 3. Use case: payment provider failure

This case demonstrates an external provider error, global exception mapping, and compensation.

Use:

```json
{
  "customer": {
    "name": "Video Provider Error Customer",
    "email": "video.provider@example.com"
  },
  "shippingAddress": {
    "street": "901 Bagby St",
    "city": "Houston",
    "state": "TX",
    "postalCode": "77002",
    "country": "United States"
  },
  "items": [
    {
      "productId": "20000000-0000-4000-8000-000000000001",
      "quantity": 1
    }
  ],
  "payment": {
    "cardNumber": "4000000000000119"
  }
}
```

Expected HTTP result:

- Status: `502 Bad Gateway`.

```json
{
  "statusCode": 502,
  "message": "Payment provider is temporarily unavailable",
  "error": "Bad Gateway"
}
```

Expected database result:

- The customer and order are persisted.
- The order status is `PAYMENT_FAILED` and its payment transaction ID is `null`.
- Houston keyboard stock remains `50` and its reservation returns to `0`.


## 4. Use case: item consolidation and single eligible warehouse

This case demonstrates duplicate item consolidation and selection of Houston even though the shipping address is in Dallas. Austin has only eight monitors and Dallas does not stock monitors, so only Houston can fulfill the complete order.

```json
{
  "customer": {
    "name": "Video Routing Customer",
    "email": "video.routing@example.com"
  },
  "shippingAddress": {
    "street": "500 Commerce St",
    "city": "Dallas",
    "state": "TX",
    "postalCode": "75202",
    "country": "United States"
  },
  "items": [
    {
      "productId": "20000000-0000-4000-8000-000000000003",
      "quantity": 4
    },
    {
      "productId": "20000000-0000-4000-8000-000000000003",
      "quantity": 5
    },
    {
      "productId": "20000000-0000-4000-8000-000000000001",
      "quantity": 9
    }
  ],
  "payment": {
    "cardNumber": "4111111111111111"
  }
}
```

Expected HTTP result:

- Status: `201 Created`.
- Status: `PAID`.
- Warehouse: `Houston Central`.
- Total: `3059.01`.
- Exactly two response items: monitor quantity `9` and keyboard quantity `9`.

Expected database result:

- Exactly two `order_items` rows exist because duplicate monitors were consolidated.
- Houston monitor stock becomes `16`.
- Houston keyboard stock becomes `41`.
- Both reservations return to `0`.

## 5. Use case: unavailable inventory

This case stops before reservation and payment.

```json
{
  "customer": {
    "name": "Video Inventory Customer",
    "email": "video.inventory@example.com"
  },
  "shippingAddress": {
    "street": "500 Commerce St",
    "city": "Dallas",
    "state": "TX",
    "postalCode": "75202",
    "country": "United States"
  },
  "items": [
    {
      "productId": "20000000-0000-4000-8000-000000000001",
      "quantity": 999
    }
  ],
  "payment": {
    "cardNumber": "4111111111111111"
  }
}
```

Expected HTTP result:

- Status: `409 Conflict`.
- Message: `No warehouse has enough inventory to fulfill the complete order`.

Expected database result:

- The customer exists because customer resolution occurs before warehouse selection.
- No order or order item exists for this customer.
- Inventory and reservations do not change.

## 6. Use case: request validation failure

This case is rejected by the global validation pipe before application logic runs.


```json
{
  "customer": {
    "name": "Video Validation Customer",
    "email": "video.validation@example.com"
  },
  "shippingAddress": {
    "street": "500 Commerce St",
    "city": "Dallas",
    "state": "TX",
    "postalCode": "75202",
    "country": "United States"
  },
  "items": [],
  "payment": {
    "cardNumber": "4111111111111111"
  }
}
```

Expected result:

- Status: `400 Bad Request`.
- No customer, order, item, payment call, or inventory mutation is created.