const Order = require('../models/Order');
const Food = require('../models/Food');
const { getDbType } = require('../config/db');

// @desc    Get dashboard metrics & system stats
// @route   GET /api/stats
exports.getStats = async (req, res, next) => {
  try {
    const orderStats = await Order.getStats();
    const totalFoods = await Food.countDocuments();
    const recentOrders = await Order.find({});

    res.status(200).json({
      success: true,
      data: {
        databaseEngine: getDbType(),
        totalFoods,
        totalOrders: orderStats.totalOrders,
        totalRevenue: orderStats.totalRevenue,
        recentOrdersCount: recentOrders.length
      }
    });
  } catch (error) {
    next(error);
  }
};
