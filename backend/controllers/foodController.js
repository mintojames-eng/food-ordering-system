const Food = require('../models/Food');
const initialFoods = require('../data/initialFoods');
const { getDbType, getSqliteDb } = require('../config/db');
const FoodMongo = require('../models/mongo/FoodMongo');

// @desc    Get all food items with optional filters
// @route   GET /api/foods
exports.getFoods = async (req, res, next) => {
  try {
    const { category, search, vegOnly, sortBy } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (vegOnly === 'true' || vegOnly === true) {
      query.isVeg = true;
    }

    if (search && search.trim() !== '') {
      query.search = search.trim();
    }

    if (sortBy) {
      query.sortBy = sortBy;
    }

    const foods = await Food.find(query);
    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food item
// @route   GET /api/foods/:id
exports.getFoodById = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: `Food item with id ${req.params.id} not found`
      });
    }
    res.status(200).json({
      success: true,
      data: food
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new food item
// @route   POST /api/foods
exports.createFood = async (req, res, next) => {
  try {
    const { name, category, price, description, image, isVeg, rating, prepTime, available } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Food item name is required' });
    }
    if (price === undefined || isNaN(Number(price)) || Number(price) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid positive price is required' });
    }

    const newFood = await Food.create({
      name: name.trim(),
      category: category || 'Other',
      price: Number(price),
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      isVeg: isVeg === undefined ? true : Boolean(isVeg),
      rating: rating ? Number(rating) : 4.5,
      prepTime: prepTime || '20-25 mins',
      available: available === undefined ? true : Boolean(available)
    });

    res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      data: newFood
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update food item
// @route   PUT /api/foods/:id
exports.updateFood = async (req, res, next) => {
  try {
    const existing = await Food.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Food item with id ${req.params.id} not found`
      });
    }

    const updated = await Food.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Food item updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete food item
// @route   DELETE /api/foods/:id
exports.deleteFood = async (req, res, next) => {
  try {
    const existing = await Food.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Food item with id ${req.params.id} not found`
      });
    }

    await Food.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: `Food item '${existing.name}' deleted successfully`,
      data: existing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset menu to default seed items
// @route   POST /api/foods/reset
exports.resetFoods = async (req, res, next) => {
  try {
    if (getDbType() === 'mongodb') {
      await FoodMongo.deleteMany({});
      await FoodMongo.insertMany(initialFoods);
    } else {
      const db = getSqliteDb();
      db.prepare('DELETE FROM foods').run();
      const insertStmt = db.prepare(`
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
    }
    const foods = await Food.find({});
    res.status(200).json({
      success: true,
      message: 'Food menu reset to default items successfully',
      count: foods.length,
      data: foods
    });
  } catch (error) {
    next(error);
  }
};
