const db = require('../db');

const handleColorInsert = async (one, two, three) => {
    const query =
      "INSERT INTO lure_color (color_first, color_second, color_third) VALUES (?, ?, ?)";
    const [result] = await db.promise().execute(query, [one, two, three]);
    return result.insertId;
  };

module.exports = { handleColorInsert };