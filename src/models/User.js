//to handle database queries cleanly
import db from '../config/db.js';

const User = {
  create({ name, email, password }) {
    const stmt = db.prepare(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
    );
    const result = stmt.run(name, email, password);
    return { id: result.lastInsertRowid, name, email };
  },

  findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },

  findById(id) {
    const stmt = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?');
    return stmt.get(id);
  }
};

export default User;