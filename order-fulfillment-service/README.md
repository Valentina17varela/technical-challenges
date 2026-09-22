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

2. **Geocoding:** A mock adapter converts the shipping address into coordinates. Dallas `TX 75202`, Austin `TX 78701`, and Houston `TX 77002` use an explicit coordinate catalog so manual warehouse-selection results are realistic and repeatable. Other addresses use a deterministic hash fallback that always returns the same synthetic coordinate within the contiguous United States. Fallback coordinates are not a real geographic lookup and exist only to keep the mock usable with arbitrary addresses. The adapter implements a port that can later be replaced by a real provider without changing the order use case.

3. **Warehouse selection:** Duplicate products are consolidated before checking stock. Only warehouses where every product satisfies `quantity - reserved_quantity >= requested quantity` are eligible. If several qualify, the nearest one is selected using the Haversine formula, with warehouse ID as a deterministic tie-breaker. If none qualifies, the API returns `409 Conflict`.

4. **Total and payment:** The backend calculates the total using database prices and sends the card number, amount, and description to the mock payment adapter. Credit card data is never persisted or logged. The mock approves valid cards by default; `4000000000000002` simulates a rejection, `4000000000000119` simulates an unexpected provider error, and `4000000000000259` simulates a timeout.

5. **Persistence:** Before payment, a transaction creates a `PENDING` order and reserves stock. Approval atomically marks it as `PAID` and commits the stock deduction; rejection marks it as `PAYMENT_FAILED` and releases the reservation.

6. **Response:** The API returns `201 Created` with the order, warehouse, items, total, and nullable payment transaction ID. Invalid requests return `400`, unavailable inventory returns `409`, and payment provider failures return `502` after compensation.

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
        text shipping_address
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

- `warehouse_inventory` models the many-to-many relationship between warehouses and products. `quantity` is the physical stock and `reserved_quantity` is stock temporarily assigned to orders whose payment is still pending. Availability is `quantity - reserved_quantity`, which prevents two concurrent orders from selling the same units.
- `reserved_quantity` is constrained between zero and `quantity`. On payment approval, reserved units are removed from physical stock; on rejection, the reservation is released without changing `quantity`.
- `order_items` preserves the purchased quantity and unit price at the time of the order. This prevents historical totals from changing when a product price is updated later.
- The shipping address and coordinates are stored in `orders` as a snapshot, so historical orders are not affected by later address or geocoding changes.
- `PENDING`, `PAID`, and `PAYMENT_FAILED` represent the payment lifecycle and make incomplete or compensated operations visible instead of deleting their history.
- Monetary columns use fixed decimal precision instead of floating-point values, avoiding binary rounding errors. Foreign keys and inventory lookup columns are indexed for order and availability queries.
- `payment_transaction_id` is nullable because it does not exist before payment approval, and unique so the same provider transaction cannot be assigned to multiple orders.
- Credit card numbers are accepted only by the request DTO and passed to the payment adapter. They are never persisted or returned.

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
2. Synchronizes the database schema from the TypeORM entities.
3. Inserts missing initial data without replacing existing records.
4. Starts the NestJS API in watch mode.

The PostgreSQL data is stored in a Docker volume and remains available between restarts.

```bash
npm run db:stop    # Stop PostgreSQL and preserve its data
npm run db:remove  # Remove PostgreSQL and all local database data
```

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`

### Production-style execution

Build the application, initialize the database, and run the compiled output:

```bash
npm ci
npm run build
npm run db:setup
npm run start:prod
```

The same required environment variables are used with a managed PostgreSQL instance. This challenge intentionally uses TypeORM schema synchronization and contains no migration files or migration commands. A real production rollout should replace synchronization with reviewed, versioned migrations.
