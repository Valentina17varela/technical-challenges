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

### Meta-instructions

- You may use the language/framework of your choice.
- There is no need to implement a full application or APIs for managing customers, warehouses, or products. Authentication is also outside the scope; only the functionality specified above is required.
- The required functionality should be production-ready. Use a real database and treat data storage and management with the rigor expected from a high-traffic production system.

<br>

## 👩🏻‍💻 Implementation

### Architecture

<div align="center" style="max-width: 700px; margin: 0 auto;">

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'background': 'transparent',
    'primaryColor': '#1E293B',
    'primaryTextColor': '#F8FAFC',
    'primaryBorderColor': '#38BDF8',
    'lineColor': '#38BDF8',
    'tertiaryColor': '#0F172A',
    'tertiaryBorderColor': '#0284C7',
    'clusterBkg': 'transparent',
    'clusterBorder': '#0284C7',
    'defaultLinkColor': '#38BDF8',
    'edgeLabelBackground': '#0F172A',
    'fontFamily': 'inter, system-ui, sans-serif'
  }
}}%%
graph TD
    subgraph ClientLayer["Client Layer"]
        Customer(("Customer / UI"))
    end

    subgraph OrderService["Order Fulfillment Service (Backend)"]
        API["POST /orders (Orders Controller)"]

        subgraph InternalModules["Core Domain Services"]
            OrderMgr["Order Service"]
            WarehouseService["Warehouse Routing Service"]
        end

        subgraph IntegrationAdapters["Replaceable Integration Adapters"]
            GeoService["Geocoding Port / Mock Adapter"]
            PaymentService["Payment Port / Mock Adapter"]
        end
    end

    subgraph StorageLayer["Database System"]
        DB[(PostgreSQL DB)]
    end

    %% Flow Steps
    Customer -->|1. POST /orders| API
    API -->|2. Process Order| OrderMgr
    OrderMgr -->|3. Geocode Address| GeoService
    OrderMgr -->|4. Get Eligible Warehouses & Nearest| WarehouseService
    WarehouseService -->|Query Prices, Stock & Coordinates| DB
    OrderMgr -->|5. Create PENDING Order & Reserve Stock| DB
    OrderMgr -->|6. Charge Card: Number, Amount & Description| PaymentService
    OrderMgr -->|7a. Approve: Mark PAID & Commit Stock| DB
    OrderMgr -->|7b. Reject: Mark PAYMENT_FAILED & Release Stock| DB
    OrderMgr -->|8. Return Response| API
    API -->|9. HTTP Response| Customer
```

</div>

1. **Order request:** The Orders Controller validates `POST /orders` and delegates the process to the Order Service. Authentication and management APIs for customers, warehouses, and products are intentionally outside the challenge scope.

2. **Geocoding:** A mock adapter converts the shipping address into coordinates. Warehouse coordinates are stored in PostgreSQL, and the adapter implements a port that can later connect to a real provider.

3. **Warehouse selection:** Only warehouses with all requested products and quantities are considered. If several qualify, the nearest one is selected using the Haversine formula; otherwise, the API returns a conflict response.

4. **Total and payment:** The backend calculates the total using database prices and sends the card number, amount, and description to the mock payment adapter. Credit card data is never persisted or logged.

5. **Persistence:** Before payment, a transaction creates a `PENDING` order and reserves stock. Approval atomically marks it as `PAID` and commits the stock deduction; rejection marks it as `PAYMENT_FAILED` and releases the reservation.

6. **Response and observability:** The API returns `201 Created` with the order details or an appropriate error status. Logs include execution and integration data while excluding sensitive information; persistent tracking can be added later.

### Data modeling

<div align="center" style="max-width: 650px; margin: 0 auto;">

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'background': 'transparent',
    'primaryColor': '#0F172A',
    'primaryTextColor': '#FFFFFF',
    'primaryBorderColor': '#38BDF8',
    'lineColor': '#38BDF8',
    'tertiaryColor': '#1E293B',
    'tertiaryBorderColor': '#0284C7',
    'attributeBackgroundColorOdd': '#1E293B',
    'attributeBackgroundColorEven': '#0F172A',
    'attributeColor': '#F8FAFC',
    'entityBorder': '#38BDF8',
    'fontFamily': 'inter, system-ui, sans-serif'
  }
}}%%
erDiagram
    CUSTOMERS ||--o{ ORDERS : "places"
    ORDERS ||--|{ ORDER_ITEMS : "contains"
    WAREHOUSES ||--o{ ORDERS : "fulfills"
    PRODUCTS ||--o{ ORDER_ITEMS : "ordered in"
    PRODUCTS ||--o{ WAREHOUSE_INVENTORY : "stocked in"
    WAREHOUSES ||--o{ WAREHOUSE_INVENTORY : "holds"

    CUSTOMERS {
        uuid id PK
        string name
        string email "UNIQUE"
    }

    PRODUCTS {
        uuid id PK
        string sku "UNIQUE"
        string name
        decimal price "CHECK >= 0"
    }

    WAREHOUSES {
        uuid id PK
        string name
        string address
        decimal latitude
        decimal longitude
    }

    WAREHOUSE_INVENTORY {
        uuid warehouse_id PK, FK
        uuid product_id PK, FK
        int quantity "CHECK >= 0"
        int reserved_quantity "CHECK >= 0 AND <= quantity"
        timestamp updated_at
    }

    ORDERS {
        uuid id PK
        uuid customer_id FK
        uuid warehouse_id FK
        string shipping_address
        decimal shipping_latitude
        decimal shipping_longitude
        decimal total_amount "CHECK >= 0"
        string status "PENDING | PAID | PAYMENT_FAILED"
        string payment_transaction_id "NULLABLE, UNIQUE"
        timestamp created_at
        timestamp updated_at
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        int quantity "CHECK > 0"
        decimal unit_price "CHECK >= 0"
    }
```

</div>

For this implementation, **PostgreSQL** was selected because customers, orders, products, warehouses, and inventory are strongly related and require transactional consistency. Each local state transition is atomic, while payment failures are handled by a compensating transaction that releases reserved stock.

- `warehouse_inventory` models the many-to-many relationship between warehouses and products. Availability is calculated as `quantity - reserved_quantity`, preventing concurrent orders from using the same stock.
- `order_items` preserves the purchased quantity and unit price at the time of the order.
- The shipping address and coordinates are stored in `orders` as a snapshot, so historical orders are not affected by later customer address changes.
- Monetary columns use a fixed decimal precision, statuses use a database enum or `CHECK`, and foreign keys are indexed. Quantities and amounts are protected by the constraints shown in the diagram.
- The nullable payment transaction identifier is stored for traceability after approval, but credit card numbers are never persisted or included in logs.

<br>

## ⚙️ How To Run

Prerequisites: Node.js and a Docker-compatible runtime.

```bash
npm install
cp example.env .env
# Replace every placeholder in .env with local values
npm run start:dev
```

`start:dev` performs the complete local setup:

1. Starts PostgreSQL and waits until it is healthy.
2. Applies pending migrations.
3. Inserts missing initial data without replacing existing records.
4. Starts the NestJS API in watch mode.

The PostgreSQL data is stored in a Docker volume and remains available between restarts.

```bash
npm run db:stop    # Stop PostgreSQL and preserve its data
npm run db:remove  # Remove PostgreSQL and all local database data
```

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`
