var express = require("express");
const app = express();
const db = require("../db");
app.use(express.json());
const { format } = require("date-fns");

const handlePostsByUser = async (req, res) => {
  const username = req.query.username;
  if (!username) return res.sendStatus(400);
  try {
    const connection = await db.promise().getConnection(); // Get a promise-based connection
    const sqlSearch = `
            SELECT catch_id, username, species_name, weight, catch_date, location_province, location_city, is_private
            FROM fish_catch
            JOIN users ON fish_catch.user_id = users.user_id
            JOIN species ON fish_catch.species_id = species.species_id
            JOIN locations ON fish_catch.location_id = locations.location_id
            WHERE is_private = 0 AND username = ?
        `;
    const [results] = await connection.execute(sqlSearch, [username]); // Use execute method

    const catchIds = results.map((item) => item.catch_id);
    const sqlImgs = `
        SELECT catch_id, image_url
        FROM images
        WHERE catch_id IN (?)
    `;

    // Suoritetaan kysely parametrilla
    const [imgResult] = await connection.execute(sqlImgs, [catchIds]);

    const imagesMap = {};
    imgResult.forEach((image) => {
      if (!imagesMap[image.catch_id]) {
        imagesMap[image.catch_id] = [];
      }
      imagesMap[image.catch_id].push(image.image_url);
    });

    const catchDataWithImages = results.map((item) => {
      let newDate;
      if (item.catch_date !== null) {
        newDate = format(item.catch_date, "dd.MM.yyyy");
      }
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
    await connection.release(); // Release the connection
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { handlePostsByUser };
