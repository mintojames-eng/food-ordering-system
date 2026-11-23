const { getSqliteDb } = require('../../config/db');

class OrderSqlite {
  static formatOrder(row) {
    if (!row) return null;
    let items = [];
    try {
      items = JSON.parse(row.items || '[]');
    } catch {
      items = [];
    }
    return {
      ...row,
      items
    };
  }

  static find(query = {}) {
    const db = getSqliteDb();
    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (query.status && query.status !== 'All') {
      sql += ' AND status = ?';
      params.push(query.status);
    }

    if (query.customerName) {
      sql += ' AND LOWER(customerName) LIKE LOWER(?)';
      params.push(`%${query.customerName}%`);
    }

    sql += ' ORDER BY createdAt DESC';

    const rows = db.prepare(sql).all(...params);
    return rows.map(this.formatOrder);
  }

  static findById(id) {
    const db = getSqliteDb();
    const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    return this.formatOrder(row);
  }

  static create(data) {
    const db = getSqliteDb();
    const id = data.id || `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const createdAt = new Date().toISOString();
    const itemsJson = typeof data.items === 'string' ? data.items : JSON.stringify(data.items || []);

    const stmt = db.prepare(`
      INSERT INTO orders (
        id, customerName, customerPhone, deliveryAddress, items,
        subtotal, tax, deliveryFee, discount, totalAmount, status, paymentMethod, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      data.customerName || 'Guest Customer',
      data.customerPhone || '9876543210',
      data.deliveryAddress || '123 Main Street',
      itemsJson,
      Number(data.subtotal || 0),
      Number(data.tax || 0),
      Number(data.deliveryFee || 0),
      Number(data.discount || 0),
      Number(data.totalAmount || 0),
      data.status || 'Placed',
      data.paymentMethod || 'Cash on Delivery',
      createdAt
    );

    return this.findById(id);
  }

  static findByIdAndUpdate(id, data) {
    const existing = this.findById(id);
    if (!existing) return null;

    const db = getSqliteDb();
    const updatedStatus = data.status || existing.status;
    const updatedAddress = data.deliveryAddress || existing.deliveryAddress;
    const updatedPhone = data.customerPhone || existing.customerPhone;

    const stmt = db.prepare(`
      UPDATE orders
      SET status = ?, deliveryAddress = ?, customerPhone = ?
      WHERE id = ?
    `);

    stmt.run(updatedStatus, updatedAddress, updatedPhone, id);
    return this.findById(id);
  }

  static findByIdAndDelete(id) {
    const existing = this.findById(id);
    if (!existing) return null;

    const db = getSqliteDb();
    db.prepare('DELETE FROM orders WHERE id = ?').run(id);
    return existing;
  }

  static countDocuments() {
    const db = getSqliteDb();
    const row = db.prepare('SELECT COUNT(*) as count FROM orders').get();
    return row.count;
  }

  static getStats() {
    const db = getSqliteDb();
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    const revenueRow = db.prepare('SELECT SUM(totalAmount) as totalRevenue FROM orders WHERE status != "Cancelled"').get();
    const totalRevenue = revenueRow.totalRevenue || 0;
    return {
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100
    };
  }
}

module.exports = OrderSqlite;
