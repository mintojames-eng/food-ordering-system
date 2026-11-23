const { getDbType } = require('../config/db');
const FoodMongo = require('./mongo/FoodMongo');
const FoodSqlite = require('./sqlite/FoodSqlite');

class Food {
  static async find(query = {}) {
    if (getDbType() === 'mongodb') {
      const filter = {};
      if (query.category && query.category !== 'All') {
        filter.category = new RegExp(`^${query.category}$`, 'i');
      }
      if (query.isVeg !== undefined) {
        filter.isVeg = query.isVeg;
      }
      if (query.search) {
        filter.$or = [
          { name: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } }
        ];
      }
      let sort = { createdAt: -1 };
      if (query.sortBy === 'price_asc') sort = { price: 1 };
      if (query.sortBy === 'price_desc') sort = { price: -1 };
      if (query.sortBy === 'rating') sort = { rating: -1 };

      const docs = await FoodMongo.find(filter).sort(sort).lean();
      return docs.map(doc => ({ ...doc, _id: undefined }));
    } else {
      return FoodSqlite.find(query);
    }
  }

  static async findById(id) {
    if (getDbType() === 'mongodb') {
      const doc = await FoodMongo.findOne({ id }).lean();
      return doc ? { ...doc, _id: undefined } : null;
    } else {
      return FoodSqlite.findById(id);
    }
  }

  static async create(data) {
    if (getDbType() === 'mongodb') {
      const id = data.id || `food_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const doc = await FoodMongo.create({ ...data, id });
      return doc.toObject();
    } else {
      return FoodSqlite.create(data);
    }
  }

  static async findByIdAndUpdate(id, data) {
    if (getDbType() === 'mongodb') {
      const doc = await FoodMongo.findOneAndUpdate({ id }, data, { new: true, runValidators: true }).lean();
      return doc ? { ...doc, _id: undefined } : null;
    } else {
      return FoodSqlite.findByIdAndUpdate(id, data);
    }
  }

  static async findByIdAndDelete(id) {
    if (getDbType() === 'mongodb') {
      const doc = await FoodMongo.findOneAndDelete({ id }).lean();
      return doc ? { ...doc, _id: undefined } : null;
    } else {
      return FoodSqlite.findByIdAndDelete(id);
    }
  }

  static async countDocuments() {
    if (getDbType() === 'mongodb') {
      return await FoodMongo.countDocuments();
    } else {
      return FoodSqlite.countDocuments();
    }
  }
}

module.exports = Food;
