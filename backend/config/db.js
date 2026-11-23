const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const mongoose = require('mongoose');

let activeDbType = process.env.DB_TYPE || 'sqlite';
let sqliteDb = null;

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const sqliteFilePath = path.join(dataDir, 'food_ordering.sqlite');

function initSqlite() {
  if (!sqliteDb) {
    sqliteDb = new DatabaseSync(sqliteFilePath);
    
    // Create foods table
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS foods (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        image TEXT,
        isVeg INTEGER NOT NULL DEFAULT 1,
        rating REAL DEFAULT 4.5,
        prepTime TEXT DEFAULT '20-25 mins',
        available INTEGER DEFAULT 1,
        createdAt TEXT
      );
    `);

    // Create orders table
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customerName TEXT NOT NULL,
        customerPhone TEXT,
        deliveryAddress TEXT,
        items TEXT NOT NULL,
        subtotal REAL NOT NULL,
        tax REAL NOT NULL,
        deliveryFee REAL NOT NULL,
        discount REAL DEFAULT 0,
        totalAmount REAL NOT NULL,
        status TEXT DEFAULT 'Placed',
        paymentMethod TEXT DEFAULT 'Cash on Delivery',
        createdAt TEXT
      );
    `);

    // Seed default items if empty
    const countRow = sqliteDb.prepare('SELECT COUNT(*) as count FROM foods').get();
    if (countRow.count === 0) {
      console.log('🌱 Seeding initial foods into SQLite database...');
      const initialFoods = require('../data/initialFoods');
      const insertStmt = sqliteDb.prepare(`
        INSERT INTO foods (id, name, category, price, description, image, isVeg, rating, prepTime, available, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const item of initialFoods) {
        insertStmt.run(
          item.id,
          item.name,
          item.category,
          item.price,
          item.description,
          item.image,
          item.isVeg ? 1 : 0,
          item.rating,
          item.prepTime,
          item.available ? 1 : 0,
          new Date().toISOString()
        );
      }
      console.log(`✅ Seeded ${initialFoods.length} foods into SQLite!`);
    }
  }
  return sqliteDb;
}

async function connectDB() {
  if (activeDbType === 'mongodb') {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food_ordering_db';
    try {
      console.log(`📡 Connecting to MongoDB at ${mongoUri}...`);
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
      console.log('✅ Connected to MongoDB successfully via Mongoose.');
      activeDbType = 'mongodb';

      // Seed MongoDB if empty
      const FoodMongo = require('../models/mongo/FoodMongo');
      const count = await FoodMongo.countDocuments();
      if (count === 0) {
        console.log('🌱 Seeding initial foods into MongoDB collection...');
        const initialFoods = require('../data/initialFoods');
        await FoodMongo.insertMany(initialFoods);
        console.log(`✅ Seeded ${initialFoods.length} foods into MongoDB!`);
      }
      return { type: 'mongodb' };
    } catch (err) {
      console.warn(`⚠️ MongoDB connection failed: ${err.message}`);
      console.log('🔄 Automatically falling back to persistent SQLite engine...');
      activeDbType = 'sqlite';
      initSqlite();
      console.log(`✅ Persistent SQLite database initialized at ${sqliteFilePath}`);
      return { type: 'sqlite', fallback: true };
    }
  } else {
    initSqlite();
    console.log(`✅ Persistent SQLite database initialized at ${sqliteFilePath}`);
    return { type: 'sqlite' };
  }
}

function getDbType() {
  return activeDbType;
}

function getSqliteDb() {
  if (!sqliteDb) {
    initSqlite();
  }
  return sqliteDb;
}

module.exports = {
  connectDB,
  getDbType,
  getSqliteDb
};
