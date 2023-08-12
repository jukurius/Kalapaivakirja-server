const db = require('../db');

const handleLureInsert = async (makerId, colorId, size) => {
    const query = "INSERT INTO lures(maker_id, color_id, size) VALUES (?, ?, ?)";
    const [result] = await db.promise().execute(query, [makerId, colorId, size]);
    return result.insertId;
  };

module.exports = { handleLureInsert };