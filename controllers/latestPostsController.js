var express = require("express");
const app = express();
const mysql = require("mysql");
const db = require("../db");
app.use(express.json());
const { format } = require('date-fns');

const handleLatestPosts = async (req, res) => {
  db.getConnection(async (err, connection) => {
    if (err) return res.sendStatus(500);
    const sqlSearch =`
      SELECT catch_id, username, species_name, weight, catch_date, catch_img, location_province, location_city
      FROM fish_catch
      JOIN users ON fish_catch.user_id = users.user_id
      JOIN species ON fish_catch.species_id = species.species_id
      JOIN locations ON fish_catch.location_id = locations.location_id
      ORDER BY catch_id DESC LIMIT 8
      `
    const search_query = mysql.format(sqlSearch, ["catch_id"]);
    await connection.query(search_query, async (err, result) => {
      connection.release()
      if (err) return res.sendStatus(500);
      const data = result.map((row) => {
        const newDate = format(row.catch_date, 'dd.MM.yyyy')
        return (
            {
                id: row.catch_id,
                username: row.username,
                species_name: row.species_name,
                weight: row.weight,
                date: newDate,
                img: row.catch_img,
                location_province: row.location_province,
                location_city: row.location_city
            }
        )
      })
      res.json(data);
    });
  });
};

module.exports = { handleLatestPosts };
