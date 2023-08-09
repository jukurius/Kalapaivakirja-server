var express = require("express");
const app = express();
const mysql = require("mysql");
const db = require("../db");
app.use(express.json());

const handleLures = async (req, res) => {
  db.getConnection(async (err, connection) => {
    if (err) return res.sendStatus(500);
    const sqlSearch = "SELECT maker_id AS id, maker_name AS value FROM lure_maker";
    const search_query = mysql.format(sqlSearch);
    await connection.query(search_query, async (err, result) => {
      connection.release();
      if (err) return res.sendStatus(500);
      res.json(result);
    });
  });
};

module.exports = { handleLures };
