var express = require("express");
const app = express();
const mysql = require("mysql");
const db = require("../db");
app.use(express.json());
const { format } = require("date-fns");

const handleLatestPosts = async (req, res) => {
  db.getConnection(async (err, connection) => {
    if (err) return res.sendStatus(500);
    const sqlSearch = `
      SELECT catch_id, username, species_name, weight, catch_date, location_province, location_city
      FROM fish_catch
      JOIN users ON fish_catch.user_id = users.user_id
      JOIN species ON fish_catch.species_id = species.species_id
      JOIN locations ON fish_catch.location_id = locations.location_id
      ORDER BY catch_id DESC LIMIT 8
      `;
    const search_query = mysql.format(sqlSearch, ["catch_id"]);
    await connection.query(search_query, async (err, results) => {
      if (err) return res.sendStatus(500);

      const sqlImgs = `
      SELECT catch_id, image_url
      FROM images
      WHERE catch_id IN (${results.map((item) => item.catch_id).join(",")})
    `;
      const img_query = mysql.format(sqlImgs);
      await connection.query(img_query, async (err, result) => {
        connection.release();
        if (err) return res.sendStatus(500); 

        const imagesMap = {};
        result.forEach((image) => {
          if (!imagesMap[image.catch_id]) {
            imagesMap[image.catch_id] = [];
          }
          imagesMap[image.catch_id].push(image.image_url);
        });

        // Add images to each user object
        const catchDataWithImages = results.map((item) => {
          const newDate = format(item.catch_date, "dd.MM.yyyy");
          return {
            id: item.catch_id,
            username: item.username,
            species_name: item.species_name,
            weight: item.weight,
            date: newDate,
            location_province: item.location_province,
            location_city: item.location_city,
            images: imagesMap[item.catch_id] || [],
          };
        });
        res.json(catchDataWithImages);
      });
    });
  });
};

module.exports = { handleLatestPosts };
