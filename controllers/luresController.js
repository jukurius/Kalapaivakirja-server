var express = require("express");
const app = express();
const db = require("../db");
app.use(express.json());

// KORJATTU
const handleLures = async (req, res) => {
  try {
    const connection = await db.promise().getConnection();
    const sqlSearch = "SELECT maker_id AS id, maker_name AS value FROM lure_maker";
    const [results] = await connection.execute(sqlSearch); // Use execute method
    res.json(results);
    await connection.release(); // Release the connection
  } catch (error) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { handleLures };
