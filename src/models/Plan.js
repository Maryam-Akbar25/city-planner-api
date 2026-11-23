//(Handles database operations related to travel plans,
// enforce ownership (user_id) on every read, update, and delete operation)
import db from '../config/db.js';

const Plan = {
  create({ userId, title, city, planDate, notes, weatherSummary, temperatureC }) {
    const stmt = db.prepare(`
      INSERT INTO plans (user_id, title, city, plan_date, notes, weather_summary, temperature_c)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(userId, title, city, planDate, notes || null, weatherSummary, temperatureC);
    return this.findByIdAndUser(result.lastInsertRowid, userId);
  },

  findAllByUser(userId) {
    const stmt = db.prepare('SELECT * FROM plans WHERE user_id = ? ORDER BY plan_date ASC');
    return stmt.all(userId);
  },

  findByIdAndUser(id, userId) {
    const stmt = db.prepare('SELECT * FROM plans WHERE id = ? AND user_id = ?');
    return stmt.get(id, userId);
  },

  update(id, userId, { title, city, planDate, notes, weatherSummary, temperatureC }) {
    const stmt = db.prepare(`
      UPDATE plans
      SET title = ?, city = ?, plan_date = ?, notes = ?, weather_summary = ?, temperature_c = ?
      WHERE id = ? AND user_id = ?
    `);
    stmt.run(title, city, planDate, notes || null, weatherSummary, temperatureC, id, userId);
    return this.findByIdAndUser(id, userId);
  },

  delete(id, userId) {
    const stmt = db.prepare('DELETE FROM plans WHERE id = ? AND user_id = ?');
    const result = stmt.run(id, userId);
    return result.changes > 0;
  }
};

export default Plan;