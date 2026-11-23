const Order = require('../models/Order');
const Food = require('../models/Food');

// @desc    Place a new food order
// @route   POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const {
      customerName,
      customerPhone,
      deliveryAddress,
      items,
      paymentMethod,
      discountCode
    } = req.body;

    if (!customerName || customerName.trim() === '') {
      return res.status(400).json({ success: false, message: 'Customer name is required' });
    }

    if (!deliveryAddress || deliveryAddress.trim() === '') {
      return res.status(400).json({ success: false, message: 'Delivery address is required' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one food item with quantity'
      });
    }

    // Process and validate items & recalculate subtotal server-side for integrity
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for item: ${item.name || item.foodId}`
        });
      }

      // Verify item price from database if foodId is supplied
      let unitPrice = Number(item.price);
      if (item.foodId) {
        const dbFood = await Food.findById(item.foodId);
        if (dbFood) {
          unitPrice = dbFood.price;
        }
      }

      const itemTotal = unitPrice * qty;
      subtotal += itemTotal;

      validatedItems.push({
        foodId: item.foodId || item.id || `item_${Date.now()}`,
        name: item.name,
        price: unitPrice,
        quantity: qty,
        image: item.image || ''
      });
    }

    // 5% GST calculation
    const tax = Math.round(subtotal * 0.05 * 100) / 100;

    // Delivery fee: Free delivery above ₹300, else ₹40
    const deliveryFee = subtotal >= 300 ? 0 : 40;

    // Coupon discount logic
    let discount = 0;
    if (discountCode) {
      const code = discountCode.trim().toUpperCase();
      if (code === 'SWIGGY50' || code === 'ZOMATO50') {
        discount = Math.min(Math.round(subtotal * 0.5), 100); // 50% off up to ₹100
      } else if (code === 'TASTY20') {
        discount = Math.round(subtotal * 0.2); // 20% off
      }
    }

    const totalAmount = Math.max(0, Math.round((subtotal + tax + deliveryFee - discount) * 100) / 100);

    const newOrder = await Order.create({
      customerName: customerName.trim(),
      customerPhone: customerPhone ? customerPhone.trim() : '9876543210',
      deliveryAddress: deliveryAddress.trim(),
      items: validatedItems,
      subtotal,
      tax,
      deliveryFee,
      discount,
      totalAmount,
      status: 'Placed',
      paymentMethod: paymentMethod || 'Cash on Delivery'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Food is being prepared.',
      data: newOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order history (all orders or filtered)
// @route   GET /api/orders
exports.getOrders = async (req, res, next) => {
  try {
    const { status, customerName } = req.query;
    const query = {};
    if (status && status !== 'All') {
      query.status = status;
    }
    if (customerName) {
      query.customerName = customerName;
    }

    const orders = await Order.find(query);
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${req.params.id} not found`
      });
    }
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, deliveryAddress, customerPhone } = req.body;
    const existing = await Order.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${req.params.id} not found`
      });
    }

    const validStatuses = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = await Order.findByIdAndUpdate(req.params.id, {
      status,
      deliveryAddress,
      customerPhone
    });

    res.status(200).json({
      success: true,
      message: `Order status updated to '${status || existing.status}'`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel or delete an order
// @route   DELETE /api/orders/:id
exports.deleteOrder = async (req, res, next) => {
  try {
    const existing = await Order.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${req.params.id} not found`
      });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: `Order ${req.params.id} deleted successfully`,
      data: existing
    });
  } catch (error) {
    next(error);
  }
};
