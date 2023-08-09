var express = require("express");
const app = express();
const mysql = require("mysql");
const db = require("../db");
app.use(express.json());

const handleCityLocation = async (req, res) => {
    const locationCode = req.query.locationCode;
    console.log(locationCode);
  db.getConnection(async (err, connection) => {
    if (err) return res.sendStatus(500);
    const sqlSearch =
      "SELECT DISTINCT location_city AS value, location_code FROM fish_catch_database.location_data WHERE location_code = ? ORDER BY location_city ASC";
    const search_query = mysql.format(sqlSearch, [locationCode]);
    await connection.query(search_query, async (err, result) => {
      connection.release();
      if (err) return res.sendStatus(500);
      const results = result.map((row, index) => {
        return (
          {
            id: index,
            value: row.value,
            code: row.location_code
          }
        )
      })
      res.json(results);
    });
  });
};

module.exports = { handleCityLocation };