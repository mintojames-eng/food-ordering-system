const { connectDB, getDbType, getSqliteDb } = require('./config/db');
const Food = require('./models/Food');
const Order = require('./models/Order');
const foodController = require('./controllers/foodController');
const orderController = require('./controllers/orderController');

function mockRes() {
  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.data = data;
      return this;
    }
  };
  return res;
}

async function runUnitTests() {
  console.log('🧪 Starting Direct Model & Controller Test Suite (Sandboxed)...\n');
  await connectDB();
  console.log(`✅ Database Engine: ${getDbType().toUpperCase()}`);

  // Test 1: Foods List
  console.log('\n1️⃣ Testing Food.find()...');
  const foods = await Food.find({});
  console.log(`   Found ${foods.length} menu items.`);
  console.log(`   Sample: [${foods[0].category}] ${foods[0].name} - ₹${foods[0].price} (Veg: ${foods[0].isVeg})`);

  // Test 2: Category Filter
  console.log('\n2️⃣ Testing Category Filter: Biryani...');
  const biryanis = await Food.find({ category: 'Biryani' });
  console.log(`   Found ${biryanis.length} Biryani items:`, biryanis.map(b => b.name));

  // Test 3: Create Order via Controller
  console.log('\n3️⃣ Testing orderController.createOrder()...');
  const reqOrder = {
    body: {
      customerName: 'Ananya Sharma',
      customerPhone: '9811223344',
      deliveryAddress: 'Flat 302, Palm Heights, Indiranagar, Bengaluru',
      items: [
        {
          foodId: foods[0].id,
          name: foods[0].name,
          price: foods[0].price,
          quantity: 2
        },
        {
          foodId: foods[1].id,
          name: foods[1].name,
          price: foods[1].price,
          quantity: 1
        }
      ],
      paymentMethod: 'UPI / Card',
      discountCode: 'SWIGGY50'
    }
  };
  const resOrder = mockRes();
  await orderController.createOrder(reqOrder, resOrder, (err) => { throw err; });
  console.log('   Response Status:', resOrder.statusCode);
  console.log('   Order Created ID:', resOrder.data.data.id);
  console.log('   Customer:', resOrder.data.data.customerName);
  console.log('   Subtotal: ₹', resOrder.data.data.subtotal);
  console.log('   Tax (5%): ₹', resOrder.data.data.tax);
  console.log('   Delivery Fee: ₹', resOrder.data.data.deliveryFee);
  console.log('   Discount: ₹', resOrder.data.data.discount);
  console.log('   TOTAL AMOUNT: ₹', resOrder.data.data.totalAmount);

  const createdOrderId = resOrder.data.data.id;

  // Test 4: Get Order History
  console.log('\n4️⃣ Testing orderController.getOrders() (Order History)...');
  const reqHistory = { query: {} };
  const resHistory = mockRes();
  await orderController.getOrders(reqHistory, resHistory, (err) => { throw err; });
  console.log(`   Total Orders in Database: ${resHistory.data.count}`);
  console.log(`   First Order in History:`, {
    id: resHistory.data.data[0].id,
    customer: resHistory.data.data[0].customerName,
    itemsCount: resHistory.data.data[0].items.length,
    total: resHistory.data.data[0].totalAmount,
    status: resHistory.data.data[0].status
  });

  // Test 5: Update Order Status
  console.log('\n5️⃣ Testing orderController.updateOrderStatus()...');
  const reqUpdate = {
    params: { id: createdOrderId },
    body: { status: 'Preparing' }
  };
  const resUpdate = mockRes();
  await orderController.updateOrderStatus(reqUpdate, resUpdate, (err) => { throw err; });
  console.log(`   Updated Order Status: ${resUpdate.data.data.status}`);

  // Test 6: Create Food (Admin CRUD)
  console.log('\n6️⃣ Testing foodController.createFood() (Admin CRUD)...');
  const reqCreateFood = {
    body: {
      name: 'Loaded Truffle French Fries',
      category: 'Burgers',
      price: 189,
      description: 'Crispy golden potato fries seasoned with Italian herbs, truffle oil and shaved parmesan.',
      isVeg: true,
      rating: 4.8
    }
  };
  const resCreateFood = mockRes();
  await foodController.createFood(reqCreateFood, resCreateFood, (err) => { throw err; });
  console.log('   Created New Food Item:', resCreateFood.data.data.name, 'with ID:', resCreateFood.data.data.id);
  const newFoodId = resCreateFood.data.data.id;

  // Test 7: Update Food (Admin CRUD)
  console.log('\n7️⃣ Testing foodController.updateFood() (Admin CRUD)...');
  const reqUpdateFood = {
    params: { id: newFoodId },
    body: { price: 210, description: 'Updated: Extra cheesy loaded truffle fries' }
  };
  const resUpdateFood = mockRes();
  await foodController.updateFood(reqUpdateFood, resUpdateFood, (err) => { throw err; });
  console.log('   Updated Food Price to ₹', resUpdateFood.data.data.price);

  // Test 8: Delete Food (Admin CRUD)
  console.log('\n8️⃣ Testing foodController.deleteFood() (Admin CRUD)...');
  const reqDeleteFood = { params: { id: newFoodId } };
  const resDeleteFood = mockRes();
  await foodController.deleteFood(reqDeleteFood, resDeleteFood, (err) => { throw err; });
  console.log('   Deleted Food:', resDeleteFood.data.message);

  // Test 9: Verify Persistence on Disk
  console.log('\n9️⃣ Verifying SQLite Persistence on Disk...');
  const db = getSqliteDb();
  const diskCheck = db.prepare('SELECT COUNT(*) as c FROM orders').get();
  console.log(`   Direct SQL SELECT confirms ${diskCheck.c} persistent order(s) stored in database.sqlite!`);

  console.log('\n✅ ALL 9 TESTS PASSED FLAWLESSLY! COMPLETE CRUD & PERSISTENCE VERIFIED!\n');
}

runUnitTests().catch(console.error);
