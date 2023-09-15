var express = require("express");
const app = express();  
const mysql = require("mysql2/promise");
const db = require("../db");
app.use(express.json());

// TOIMII
const handleLocations = async (req, res) => {
  try {
    const connection = await db.promise().getConnection();
    const sqlSearch =
      "SELECT DISTINCT location_province AS value, location_code AS id FROM fish_catch_database.location_data ORDER BY location_province ASC";
    const [results] = await connection.execute(sqlSearch); // Use execute method
    res.json(results);
    connection.release(); // Release the connection
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = { handleLocations };
