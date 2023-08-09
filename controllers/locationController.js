var express = require("express");
const app = express();
const mysql = require("mysql");
const db = require("../db");
app.use(express.json());

const handleLocations = async (req, res) => {
  db.getConnection(async (err, connection) => {
    if (err) return res.sendStatus(500);
    const sqlSearch =
      "SELECT DISTINCT location_province AS value, location_code AS id FROM fish_catch_database.location_data ORDER BY location_province ASC";
    const search_query = mysql.format(sqlSearch);
    await connection.query(search_query, async (err, result) => {
      connection.release();
      if (err) return res.sendStatus(500);
      res.json(result);
    });
  });
};

module.exports = { handleLocations };
