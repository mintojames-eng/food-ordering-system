# Legacy JSON Server Architecture & Conversion Overview

## Background
The original application used `json-server` (`json-server --watch db.json --port 5000`) for mock frontend-backend interactions.

### Limitations of the Legacy JSON Server Setup:
1. **No Validation or Business Logic**: Anyone can POST arbitrary JSON without checking quantities, prices, or required fields.
2. **No Data Modeling / Integrity**: No database schema, relational constraints, or MongoDB object modeling.
3. **No Dynamic Calculations**: Taxes, delivery fees, discount calculations, and stock checks had to be done entirely on the client, exposing business logic to tampering.
4. **No Multi-Database Support**: Bound to a single flat JSON file with file-lock race conditions.

---

## The Upgraded Architecture (Node.js + Express + MongoDB/SQLite)

In this project, the legacy JSON Server has been replaced with an enterprise-grade Express.js REST API with dual database compatibility:
- **MongoDB + Mongoose**: Complete Object-Data Modeling with strict schemas, validation rules, indices, and aggregations.
- **SQLite Engine**: Zero-configuration relational database with persistent file storage (`data/food_ordering.sqlite`), foreign keys, and atomic transactions.
- **RESTful Endpoints**:
  - `GET /api/foods`: Filterable menu with query params (`category`, `search`, `vegOnly`, `sortBy`)
  - `POST /api/foods`: Validated creation of new menu items
  - `PUT /api/foods/:id`: Safe updates with validation
  - `DELETE /api/foods/:id`: Cascaded deletion
  - `POST /api/orders`: Server-side total calculation (Subtotal + GST + Delivery Fee - Discounts)
  - `GET /api/orders`: Order history query with pagination & filtering
  - `PUT /api/orders/:id`: Status pipeline (`Placed` -> `Preparing` -> `Out for Delivery` -> `Delivered` / `Cancelled`)
  - `DELETE /api/orders/:id`: Order cancellation with audit trail
