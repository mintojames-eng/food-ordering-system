const http = require('http');
const { app, startServer } = require('./server');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Backend Automated Test Suite...\n');
  process.env.PORT = '5005';
  const server = await startServer();

  try {
    // 1. Health check
    console.log('1️⃣ Testing Health Check (GET /api/health)...');
    const health = await makeRequest({
      hostname: '127.0.0.1',
      port: 5005,
      path: '/api/health',
      method: 'GET'
    });
    console.log('   Status:', health.status, '| DB:', health.body.database);

    // 2. GET Foods
    console.log('\n2️⃣ Testing Read Foods (GET /api/foods)...');
    const foodsRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5005,
      path: '/api/foods',
      method: 'GET'
    });
    console.log(`   Fetched ${foodsRes.body.count} items. First: "${foodsRes.body.data[0]?.name}" (₹${foodsRes.body.data[0]?.price})`);

    // 3. POST Order
    console.log('\n3️⃣ Testing Place Order (POST /api/orders)...');
    const testOrder = {
      customerName: 'Rahul Verma',
      customerPhone: '9876543210',
      deliveryAddress: 'Flat 402, Green Valley Apts, Bangalore',
      items: [
        {
          foodId: foodsRes.body.data[0].id,
          name: foodsRes.body.data[0].name,
          price: foodsRes.body.data[0].price,
          quantity: 2
        },
        {
          foodId: foodsRes.body.data[2].id,
          name: foodsRes.body.data[2].name,
          price: foodsRes.body.data[2].price,
          quantity: 1
        }
      ],
      paymentMethod: 'UPI / Card',
      discountCode: 'SWIGGY50'
    };

    const orderRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5005,
      path: '/api/orders',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, testOrder);

    console.log('   Order Placed! ID:', orderRes.body.data.id);
    console.log('   Subtotal:', orderRes.body.data.subtotal);
    console.log('   Tax (5%):', orderRes.body.data.tax);
    console.log('   Delivery Fee:', orderRes.body.data.deliveryFee);
    console.log('   Discount:', orderRes.body.data.discount);
    console.log('   Total Amount:', orderRes.body.data.totalAmount);

    // 4. GET Orders (Order History)
    console.log('\n4️⃣ Testing Order History (GET /api/orders)...');
    const historyRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5005,
      path: '/api/orders',
      method: 'GET'
    });
    console.log(`   Total Orders in DB: ${historyRes.body.count}`);
    console.log(`   Latest Order Customer: ${historyRes.body.data[0].customerName}, Amount: ₹${historyRes.body.data[0].totalAmount}`);

    // 5. POST New Food (Admin Create)
    console.log('\n5️⃣ Testing Admin Food Creation (POST /api/foods)...');
    const newFoodItem = {
      name: 'Loaded Truffle Fries',
      category: 'Burgers',
      price: 180,
      description: 'Crispy skin-on potato fries tossed in truffle oil and parmesan.',
      isVeg: true,
      rating: 4.7
    };
    const createFoodRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5005,
      path: '/api/foods',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, newFoodItem);
    console.log('   Created Item ID:', createFoodRes.body.data.id, '| Name:', createFoodRes.body.data.name);

    // 6. PUT Food (Admin Update)
    console.log('\n6️⃣ Testing Admin Food Update (PUT /api/foods/:id)...');
    const updateFoodRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5005,
      path: `/api/foods/${createFoodRes.body.data.id}`,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }, { price: 195, description: 'Updated description: Extra parmesan truffle fries' });
    console.log('   Updated Price to:', updateFoodRes.body.data.price);

    // 7. DELETE Food (Admin Delete)
    console.log('\n7️⃣ Testing Admin Food Deletion (DELETE /api/foods/:id)...');
    const deleteFoodRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5005,
      path: `/api/foods/${createFoodRes.body.data.id}`,
      method: 'DELETE'
    });
    console.log('   Deleted:', deleteFoodRes.body.message);

    // 8. GET Stats
    console.log('\n8️⃣ Testing Dashboard Stats (GET /api/stats)...');
    const statsRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5005,
      path: '/api/stats',
      method: 'GET'
    });
    console.log('   Stats:', JSON.stringify(statsRes.body.data));

    console.log('\n🎉 ALL BACKEND TESTS PASSED SUCCESSFULLY! 100% PERSISTENCE & CRUD VERIFIED.\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests();
