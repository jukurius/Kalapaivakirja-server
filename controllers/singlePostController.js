var express = require("express");
const app = express();
const mysql = require("mysql");
const db = require("../db");
app.use(express.json());
const { format } = require("date-fns");

const handleSinglePost = async (req, res) => {
    const postId = req.query.id;
    if (!postId) return res.sendStatus(404);
    console.log(postId)
    
  db.getConnection(async (err, connection) => {
    if (err) return res.sendStatus(500);
    const sqlSearch = `
    SELECT catch_id, username, species_name, weight, catch_date, location_province, location_city, location_lake, maker_name, color_first, color_second, color_third, size, air_temperature, water_tempature, wind
    FROM fish_catch_database.fish_catch 
    JOIN users ON fish_catch.user_id = users.user_id 
    JOIN species ON fish_catch.species_id = species.species_id 
    JOIN locations ON fish_catch.location_id = locations.location_id
    JOIN lures ON fish_catch.lure_id = lures.lure_id
    JOIN lure_maker ON lures.maker_id = lure_maker.maker_id
    JOIN lure_color ON lures.color_id = lure_color.color_id
    JOIN weather ON fish_catch.weather_id = weather.weather_id
    WHERE catch_id = ?;
    `;
    const search_query = mysql.format(sqlSearch, [postId]);
    await connection.query(search_query, async (err, results) => {
      if (err) return res.sendStatus(500);
      const sqlImg = "SELECT image_url FROM images WHERE catch_id = ?"
      const img_query = mysql.format(sqlImg, [postId]);
      await connection.query(img_query, async (err, result) => {
        connection.release();
        if (err) return res.sendStatus(500);
        const singleDataWithImages = results.map((item) => {
          const newDate = format(item.catch_date, "dd.MM.yyyy");
          return {
            id: item.catch_id,
            username: item.username,
            species_name: item.species_name,
            weight: item.weight,
            date: newDate,
            location_province: item.location_province,
            location_city: item.location_city,
            location_lake: item.location_lake,
            maker_name: item.maker_name,
            color_first: item.color_first,
            color_second: item.color_second,
            color_third: item.color_third,
            size: item.size,
            air_temp: item.air_temperature,
            water_temp: item.water_tempature,
            wind: item.wind,
            images: result
          };
        });
        res.json(singleDataWithImages);
      });
    });
  });
};

module.exports = { handleSinglePost };