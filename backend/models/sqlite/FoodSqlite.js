const { getSqliteDb } = require('../../config/db');

class FoodSqlite {
  static find(query = {}) {
    const db = getSqliteDb();
    let sql = 'SELECT * FROM foods WHERE 1=1';
    const params = [];

    if (query.category && query.category !== 'All') {
      sql += ' AND LOWER(category) = LOWER(?)';
      params.push(query.category);
    }

    if (query.isVeg !== undefined) {
      sql += ' AND isVeg = ?';
      params.push(query.isVeg ? 1 : 0);
    }

    if (query.search) {
      sql += ' AND (LOWER(name) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))';
      params.push(`%${query.search}%`, `%${query.search}%`);
    }

    if (query.sortBy === 'price_asc') {
      sql += ' ORDER BY price ASC';
    } else if (query.sortBy === 'price_desc') {
      sql += ' ORDER BY price DESC';
    } else if (query.sortBy === 'rating') {
      sql += ' ORDER BY rating DESC';
    } else {
      sql += ' ORDER BY createdAt DESC';
    }

    const rows = db.prepare(sql).all(...params);
    return rows.map(r => ({
      ...r,
      isVeg: Boolean(r.isVeg),
      available: Boolean(r.available)
    }));
  }

  static findById(id) {
    const db = getSqliteDb();
    const row = db.prepare('SELECT * FROM foods WHERE id = ?').get(id);
    if (!row) return null;
    return {
      ...row,
      isVeg: Boolean(row.isVeg),
      available: Boolean(row.available)
    };
  }

  static create(data) {
    const db = getSqliteDb();
    const id = data.id || `food_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const createdAt = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO foods (id, name, category, price, description, image, isVeg, rating, prepTime, available, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      data.name,
      data.category || 'Other',
      Number(data.price),
      data.description || '',
      data.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      data.isVeg === false || data.isVeg === 0 || data.isVeg === 'false' ? 0 : 1,
      data.rating ? Number(data.rating) : 4.5,
      data.prepTime || '20-25 mins',
      data.available === false || data.available === 0 || data.available === 'false' ? 0 : 1,
      createdAt
    );

    return this.findById(id);
  }

  static findByIdAndUpdate(id, data) {
    const existing = this.findById(id);
    if (!existing) return null;

    const db = getSqliteDb();
    const updated = {
      name: data.name !== undefined ? data.name : existing.name,
      category: data.category !== undefined ? data.category : existing.category,
      price: data.price !== undefined ? Number(data.price) : existing.price,
      description: data.description !== undefined ? data.description : existing.description,
      image: data.image !== undefined ? data.image : existing.image,
      isVeg: data.isVeg !== undefined ? (data.isVeg ? 1 : 0) : (existing.isVeg ? 1 : 0),
      rating: data.rating !== undefined ? Number(data.rating) : existing.rating,
      prepTime: data.prepTime !== undefined ? data.prepTime : existing.prepTime,
      available: data.available !== undefined ? (data.available ? 1 : 0) : (existing.available ? 1 : 0)
    };

    const stmt = db.prepare(`
      UPDATE foods
      SET name = ?, category = ?, price = ?, description = ?, image = ?, isVeg = ?, rating = ?, prepTime = ?, available = ?
      WHERE id = ?
    `);

    stmt.run(
      updated.name,
      updated.category,
      updated.price,
      updated.description,
      updated.image,
      updated.isVeg,
      updated.rating,
      updated.prepTime,
      updated.available,
      id
    );

    return this.findById(id);
  }

  static findByIdAndDelete(id) {
    const existing = this.findById(id);
    if (!existing) return null;

    const db = getSqliteDb();
    db.prepare('DELETE FROM foods WHERE id = ?').run(id);
    return existing;
  }

  static countDocuments() {
    const db = getSqliteDb();
    const row = db.prepare('SELECT COUNT(*) as count FROM foods').get();
    return row.count;
  }
}

module.exports = FoodSqlite;
