const { getDbType } = require('../config/db');
const OrderMongo = require('./mongo/OrderMongo');
const OrderSqlite = require('./sqlite/OrderSqlite');

class Order {
  static async find(query = {}) {
    if (getDbType() === 'mongodb') {
      const filter = {};
      if (query.status && query.status !== 'All') {
        filter.status = query.status;
      }
      if (query.customerName) {
        filter.customerName = { $regex: query.customerName, $options: 'i' };
      }
      const docs = await OrderMongo.find(filter).sort({ createdAt: -1 }).lean();
      return docs.map(doc => ({ ...doc, _id: undefined }));
    } else {
      return OrderSqlite.find(query);
    }
  }

  static async findById(id) {
    if (getDbType() === 'mongodb') {
      const doc = await OrderMongo.findOne({ id }).lean();
      return doc ? { ...doc, _id: undefined } : null;
    } else {
      return OrderSqlite.findById(id);
    }
  }

  static async create(data) {
    if (getDbType() === 'mongodb') {
      const id = data.id || `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
      const doc = await OrderMongo.create({ ...data, id });
      return doc.toObject();
    } else {
      return OrderSqlite.create(data);
    }
  }

  static async findByIdAndUpdate(id, data) {
    if (getDbType() === 'mongodb') {
      const doc = await OrderMongo.findOneAndUpdate({ id }, data, { new: true }).lean();
      return doc ? { ...doc, _id: undefined } : null;
    } else {
      return OrderSqlite.findByIdAndUpdate(id, data);
    }
  }

  static async findByIdAndDelete(id) {
    if (getDbType() === 'mongodb') {
      const doc = await OrderMongo.findOneAndDelete({ id }).lean();
      return doc ? { ...doc, _id: undefined } : null;
    } else {
      return OrderSqlite.findByIdAndDelete(id);
    }
  }

  static async countDocuments() {
    if (getDbType() === 'mongodb') {
      return await OrderMongo.countDocuments();
    } else {
      return OrderSqlite.countDocuments();
    }
  }

  static async getStats() {
    if (getDbType() === 'mongodb') {
      const totalOrders = await OrderMongo.countDocuments();
      const stats = await OrderMongo.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
      ]);
      const totalRevenue = stats.length > 0 ? Math.round(stats[0].totalRevenue * 100) / 100 : 0;
      return { totalOrders, totalRevenue };
    } else {
      return OrderSqlite.getStats();
    }
  }
}

module.exports = Order;
