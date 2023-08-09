var express = require("express");
const app = express();
const mysql = require("mysql");
const db = require("../db");
app.use(express.json());

const handleSpecies = async (req, res) => {
  db.getConnection(async (err, connection) => {
    if (err) return res.sendStatus(500);
    const sqlSearch =
      "SELECT species_id AS id, species_name AS value FROM species";
    const search_query = mysql.format(sqlSearch);
    await connection.query(search_query, async (err, result) => {
      connection.release();
      if (err) return res.sendStatus(500);
      res.json(result);
    });
  });
};

module.exports = { handleSpecies };
