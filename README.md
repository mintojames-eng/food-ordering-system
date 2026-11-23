# 🍕 Swiggy & Zomato Style Food Ordering System

A full-stack, responsive, and robust **Food Ordering Web Application** built with **React** (Frontend), **Node.js + Express** (Backend), and **SQLite / MongoDB** (Database Persistence).

Converted from a mock JSON-server prototype into an enterprise-ready, production-grade architecture as part of a 2-student team development project.

---

## 🌟 Key Features

### 👤 Customer Experience (Frontend)
- **Select Food Dishes**: Browse a rich catalog of 12+ pre-seeded popular cuisines (Biryani, Pizza, Burgers, Indo-Chinese Asian, North Indian, Desserts, Beverages).
- **Search & Filters**: Instant search by dish name or ingredients, category pills, **Pure Veg Only** toggle, and price/rating sorting.
- **Dynamic Quantity Stepper**: Seamlessly adjust item quantities (`ADD` button transforms to `[-] [qty] [+]` controls).
- **Interactive Cart & Checkout**:
  - Slide-out drawer with real-time bill calculation.
  - Subtotal, 5% GST calculation, and delivery fees.
  - **Free Delivery progress banner** (Unlocked above ₹300).
  - Promo code discounts (e.g. `SWIGGY50` for 50% off up to ₹100, `TASTY20` for 20% off).
  - Delivery address & customer contact form.
- **Place Order**: One-click order creation stored directly into the database.
- **Order History & Tracking**:
  - Displays all past orders with timestamp, customer info, itemized dishes, and **Total Amount**.
  - Visual status badges: `Placed`, `Preparing`, `Out for Delivery`, `Delivered`, `Cancelled`.
  - **Cancel Order** button & **Reorder** button.

### ⚙️ Backend & Database Architecture
- **Express.js REST API**: Clean controller-model-route pattern replacing mock JSON Server endpoints.
- **Dual Database Persistence**:
  - **SQLite (Default / Zero-Config)**: Uses Node.js native `DatabaseSync` (`node:sqlite`). Stored physically on disk at `backend/data/food_ordering.sqlite`. Requires 0 external setup or daemons!
  - **MongoDB + Mongoose (Configurable)**: Complete document schemas with strict typing, enum validation, and aggregations.
- **Full CRUD Support**:
  - **Create**: Add new food dishes, Place orders.
  - **Read**: Fetch menu items with filters, Fetch order history.
  - **Update**: Edit food item details, Update order delivery statuses.
  - **Delete**: Remove dishes, Cancel / delete orders.
- **Admin Management Dashboard**: Built-in visual interface to inspect live database metrics, perform CRUD operations, and reset sample data.

---

## 👥 2-Student Team Task Distribution

| Student | Assigned Role | Key Modules Delivered |
| :--- | :--- | :--- |
| **Student 1** | **Frontend & UI/UX Engineer** | • React components (`FoodCard`, `FoodList`, `Navbar`, `CartDrawer`, `OrderHistory`)<br>• Global Cart Context (`CartContext.jsx`) & LocalStorage persistence<br>• Swiggy / Zomato custom UI styling (`App.css`, `index.css`)<br>• Client-side order tracking & feedback modals |
| **Student 2** | **Backend & Database Engineer** | • Express server architecture & routing (`server.js`, `routes/`, `controllers/`)<br>• Dual Database Engine & Schemas (`db.js`, `Food.js`, `Order.js`)<br>• Server-side bill calculations (Subtotal, GST, Delivery fees, Discounts)<br>• Automated verification test suite (`test_units.js`) & Admin CRUD interface |

---

## 📁 Project Directory Structure

```
food-ordering-system/
├── backend/
│   ├── config/
│   │   └── db.js                    # Dual DB Connector (SQLite + MongoDB fallback)
│   ├── controllers/
│   │   ├── foodController.js        # Food CRUD operations
│   │   ├── orderController.js       # Order CRUD & History operations
│   │   └── statsController.js       # System metrics & analytics
│   ├── data/
│   │   ├── initialFoods.js          # Seed dataset (12 dishes)
│   │   └── food_ordering.sqlite     # Persistent SQLite database file
│   ├── legacy-json-server/
│   │   ├── db.json                  # Original mock JSON-server reference
│   │   └── README.md                # JSON server comparison notes
│   ├── middleware/
│   │   └── errorHandler.js          # Centralized error handler
│   ├── models/
│   │   ├── mongo/                   # Mongoose schemas (FoodMongo, OrderMongo)
│   │   ├── sqlite/                  # SQLite repositories (FoodSqlite, OrderSqlite)
│   │   ├── Food.js                  # Unified Food model facade
│   │   └── Order.js                 # Unified Order model facade
│   ├── routes/
│   │   ├── foodRoutes.js            # /api/foods
│   │   ├── orderRoutes.js           # /api/orders
│   │   └── statsRoutes.js           # /api/stats
│   ├── test_units.js                # Automated backend test suite
│   ├── server.js                    # Express app entry point
│   ├── package.json
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Header, logo, location & cart badge
│   │   │   ├── FoodCard.jsx         # Dish card with stepper (+ / -)
│   │   │   ├── FoodList.jsx         # Menu grid, search & category filters
│   │   │   ├── CartDrawer.jsx       # Checkout drawer & bill breakdown
│   │   │   ├── OrderHistory.jsx     # Order history & status tracking
│   │   │   ├── AdminPanel.jsx       # Full CRUD management panel
│   │   │   └── OrderSuccessModal.jsx# Animated order confirmation
│   │   ├── context/
│   │   │   └── CartContext.jsx      # Global cart state & calculations
│   │   ├── services/
│   │   │   └── api.js               # REST API client
│   │   ├── App.jsx                  # Main view switcher
│   │   ├── App.css                  # Swiggy/Zomato design system
│   │   ├── index.css                # Global styles
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json                     # Root orchestrator
├── start_app.bat                    # 1-Click launcher
├── start_dev.bat                    # Development launcher
├── MIGRATION_GUIDE.md               # Detailed academic report & schema specs
└── README.md                        # Documentation
```

---

## 🚀 Quick Start Guide

### Option 1: 1-Click Launch (Recommended for Windows)
Simply double-click:
```bash
start_app.bat
```
This starts the Node.js/Express server on **`http://localhost:5000`** and opens the application in your default web browser!

---

### Option 2: Run via Terminal

#### 1. Start the Backend:
```bash
cd backend
npm start
```
*Backend runs on `http://localhost:5000` with the SQLite database initialized and auto-seeded!*

#### 2. Start the Frontend (Development Mode with HMR):
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:3000` with instant hot-reload and proxy to backend.*

---

## 🧪 Automated Testing & Data Persistence Proof

To run the automated test suite demonstrating complete CRUD operations and database disk persistence:

```bash
cd backend
npm test
```

### Output:
```text
🧪 Starting Direct Model & Controller Test Suite (Sandboxed)...

✅ Persistent SQLite database initialized at .../data/food_ordering.sqlite
✅ Database Engine: SQLITE

1️⃣ Testing Food.find()...
   Found 12 menu items.
2️⃣ Testing Category Filter: Biryani...
   Found 2 Biryani items: [ 'Hyderabadi Chicken Dum Biryani', 'Paneer Butter Masala Biryani' ]
3️⃣ Testing orderController.createOrder()...
   Order Created ID: ORD-226966-609
   Customer: Ananya Sharma
   Subtotal: ₹ 517 | Tax (5%): ₹ 25.85 | Discount: ₹ 100 | TOTAL AMOUNT: ₹ 442.85
4️⃣ Testing orderController.getOrders() (Order History)...
   Total Orders in Database: 1
5️⃣ Testing orderController.updateOrderStatus()...
   Updated Order Status: Preparing
6️⃣ Testing foodController.createFood() (Admin CRUD)...
   Created New Food Item: Loaded Truffle French Fries
7️⃣ Testing foodController.updateFood() (Admin CRUD)...
   Updated Food Price to ₹ 210
8️⃣ Testing foodController.deleteFood() (Admin CRUD)...
   Deleted Food: Food item 'Loaded Truffle French Fries' deleted successfully
9️⃣ Verifying SQLite Persistence on Disk...
   Direct SQL SELECT confirms 1 persistent order(s) stored in database.sqlite!

✅ ALL 9 TESTS PASSED FLAWLESSLY! COMPLETE CRUD & PERSISTENCE VERIFIED!
```

---

## 🔄 Switching to MongoDB

By default, the application uses **SQLite** which requires zero configuration and stores data persistently in `backend/data/food_ordering.sqlite`.

If you wish to run with **MongoDB**:
1. Make sure MongoDB daemon (`mongod`) is running on your machine or have a MongoDB Atlas connection string.
2. Edit `backend/.env`:
   ```env
   DB_TYPE=mongodb
   MONGODB_URI=mongodb://127.0.0.1:27017/food_ordering_db
   ```
3. Restart the server (`npm start`). If MongoDB is unreachable, the system will automatically fall back to SQLite to prevent any downtime!

---

## 📡 REST API Reference

| Method | Endpoint | Description | Sample Payload / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/foods` | List all menu dishes | `?category=Pizza&vegOnly=true&search=Cheese` |
| `GET` | `/api/foods/:id` | Get single dish | - |
| `POST` | `/api/foods` | Add new dish (Create) | `{"name":"Paneer Tikka","price":260,"category":"North Indian","isVeg":true}` |
| `PUT` | `/api/foods/:id` | Update dish (Update) | `{"price":280}` |
| `DELETE` | `/api/foods/:id` | Delete dish (Delete) | - |
| `POST` | `/api/foods/reset` | Reset to default 12 dishes | - |
| `GET` | `/api/orders` | Get order history | `?status=Placed` |
| `POST` | `/api/orders` | Place new order | `{"customerName":"Rahul","deliveryAddress":"Indiranagar","items":[{"foodId":"food_1","quantity":2}]}` |
| `PUT` | `/api/orders/:id` | Update order status | `{"status":"Preparing"}` |
| `DELETE` | `/api/orders/:id` | Cancel / Delete order | - |
| `GET` | `/api/stats` | System stats & DB engine | - |

---

## 🎓 Academic Evaluation Highlights

- **JSON Server replaced**: Full Express REST API with input validation, error handling middleware, and status codes.
- **Database Schema Designed**: Complete Mongoose Models & Relational SQLite DDL with relational fields.
- **Full CRUD Implemented**: Create, Read, Update, and Delete operations for both Menu Dishes and Customer Orders.
- **Customer UI Preserved & Upgraded**: Modern Swiggy/Zomato inspired interface with item selection, quantity adjustments, live bill summary, and persistent order history.
- **Data Persistence Demonstrated**: Proven via automated test suite and persistent storage across server restarts.
