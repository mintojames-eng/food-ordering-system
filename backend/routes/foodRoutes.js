const express = require('express');
const router = express.Router();
const {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  resetFoods
} = require('../controllers/foodController');

router.route('/')
  .get(getFoods)
  .post(createFood);

router.post('/reset', resetFoods);

router.route('/:id')
  .get(getFoodById)
  .put(updateFood)
  .delete(deleteFood);

module.exports = router;
