require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getDbType } = require('./config/db');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const statsRoutes = require('./routes/statsRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Food Ordering System API',
    database: getDbType(),
    timestamp: new Date().toISOString()
  });
});

// Root API Directory Route
app.get(['/api', '/api/'], (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Food Ordering System REST API (Swiggy & Zomato Clone)',
    databaseEngine: getDbType().toUpperCase(),
    endpoints: {
      health: 'GET /api/health',
      foods: 'GET /api/foods (supports ?category=&search=&vegOnly=&sortBy=)',
      foodById: 'GET /api/foods/:id',
      createFood: 'POST /api/foods',
      updateFood: 'PUT /api/foods/:id',
      deleteFood: 'DELETE /api/foods/:id',
      resetFoods: 'POST /api/foods/reset',
      orders: 'GET /api/orders (supports ?status=&customerName=)',
      orderById: 'GET /api/orders/:id',
      createOrder: 'POST /api/orders',
      updateOrder: 'PUT /api/orders/:id',
      deleteOrder: 'DELETE /api/orders/:id',
      stats: 'GET /api/stats'
    },
    webUI: `http://localhost:${PORT}/`
  });
});

// API Routes
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);

// Catch-all 404 for undefined /api routes
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found.`
  });
});

// Serve Static Frontend if built
const path = require('path');
const fs = require('fs');
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // 404 Handler if frontend is not built
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Resource ${req.method} ${req.originalUrl} not found.`
    });
  });
}

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server
async function startServer() {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 Food Ordering Server is live on port ${PORT}!`);
      console.log(`📦 Active Database: ${getDbType().toUpperCase()}`);
      console.log(`-------------------------------------------------------`);
      console.log(`📱 Web App (React UI): http://localhost:${PORT}/`);
      console.log(`🌐 API Directory:      http://localhost:${PORT}/api`);
      console.log(`🍕 Food Menu API:      http://localhost:${PORT}/api/foods`);
      console.log(`📋 Orders History API: http://localhost:${PORT}/api/orders`);
      console.log(`📊 Metrics API:        http://localhost:${PORT}/api/stats`);
      console.log(`=======================================================`);
    });
    return server;
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
