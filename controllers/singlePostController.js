var express = require("express");
const app = express();
const mysql = require("mysql");
const db = require("../db");
app.use(express.json());

const handleSinglePost = async (req, res) => {
    const postId = req.query.id;
    if (!postId) return res.sendStatus(404);
    
  db.getConnection(async (err, connection) => {
    if (err) return res.sendStatus(500);
    const sqlSearch = `
    SELECT catch_id, username, species_name, weight, catch_date, catch_img,location_province, location_city, location_lake, lure_name, color, size, air_temperature, water_tempature, wind
    FROM fish_catch 
    JOIN users ON fish_catch.user_id = users.user_id 
    JOIN species ON fish_catch.species_id = species.species_id 
    JOIN locations ON fish_catch.location_id = locations.location_id
    JOIN lures ON fish_catch.lure_id = lures.lure_id
    JOIN weather ON fish_catch.weather_id = weather.weather_id
    WHERE catch_id = ?
    `;
    const search_query = mysql.format(sqlSearch, [postId]);
    await connection.query(search_query, async (err, result) => {
      connection.release();
      if (err) return res.sendStatus(500);
      res.json(result);
    });
  });
};

module.exports = { handleSinglePost };