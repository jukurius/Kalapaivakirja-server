var express = require("express");
const app = express();
const mysql = require("mysql");
const db = require("../db");
app.use(express.json());
const { format } = require("date-fns");

const handleFilterQuery = async (req, res) => {
  const object = req.query;
  const page = parseInt(req.query.page) || 1;
  const perPage = 20; // Number of items to return per page
  const startIndex = (page - 1) * perPage;
  var array = [];
  var allValues = [];
  var sql;

  if (object) {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        for (const k in object[key]) {
          if (object[key].hasOwnProperty(k)) {
            if (k === "filterArr") {
              array.push(object[key]);
            }
          }
        }
      }
    }

    const unionQueries = array.map(({ filterType, filterArr }) => {
      const placeholders = filterArr
        .map(() => `${filterType} = ?`)
        .join(" OR ");
      for (const value of filterArr) {
        allValues.push(value);
      }
      return `${placeholders}`;
    });
    sql = unionQueries.join(" OR ");
  }

  db.getConnection(async (err, connection) => {
    if (err) return res.sendStatus(500);
    var sqlSearch;
    var sqlTotalQuery;
    var totalQuery;
    var search_query;
    if (array.length == 0) {
      sqlSearch = `
        SELECT catch_id, username, species_name, weight, catch_date, location_province, location_city FROM fish_catch 
        JOIN users ON fish_catch.user_id = users.user_id 
        JOIN species ON fish_catch.species_id = species.species_id 
        JOIN lures ON fish_catch.lure_id = lures.lure_id 
        JOIN locations ON fish_catch.location_id = locations.location_id 
        JOIN weather ON fish_catch.weather_id = weather.weather_id
        LIMIT ?, ?
        `;
      search_query = mysql.format(sqlSearch, [startIndex, perPage]);
      sqlTotalQuery = `
      SELECT COUNT(*) AS total FROM fish_catch
      `;
      totalQuery = mysql.format(sqlTotalQuery);
    } else {
      if (array.includes("lure_id")) {
      }
      sqlSearch = `
      SELECT catch_id, username, species_name, weight, catch_date, location_province, location_city, maker_name
      FROM fish_catch 
      JOIN users ON fish_catch.user_id = users.user_id 
      JOIN species ON fish_catch.species_id = species.species_id 
      JOIN locations ON fish_catch.location_id = locations.location_id 
      JOIN lures ON fish_catch.lure_id = lures.lure_id 
      JOIN lure_maker ON lures.maker_id = lure_maker.maker_id
      WHERE
      `;
      sqlSearch += sql;
      sqlSearch += " LIMIT ?, ?";
      sqlTotalQuery = `
      SELECT COUNT(*) AS total 
      FROM fish_catch 
      JOIN users ON fish_catch.user_id = users.user_id 
      JOIN species ON fish_catch.species_id = species.species_id 
      JOIN locations ON fish_catch.location_id = locations.location_id 
      JOIN lures ON fish_catch.lure_id = lures.lure_id 
      JOIN lure_maker ON lures.maker_id = lure_maker.maker_id
      WHERE
      `;
      sqlTotalQuery += sql;
      totalQuery = mysql.format(sqlTotalQuery, allValues);
      allValues.push(startIndex, perPage);
      search_query = mysql.format(sqlSearch, allValues);
    }
    await connection.query(search_query, async (err, results) => {
      if (err) return res.sendStatus(500);
      const sqlImgs = `
      SELECT catch_id, image_url
      FROM images
      WHERE catch_id IN (${results.map((item) => item.catch_id).join(",")})
    `;
      const img_query = mysql.format(sqlImgs);
      await connection.query(img_query, async (err, result) => {
        if (err) return res.sendStatus(500);
        const imagesMap = {};
        result.forEach((image) => {
          if (!imagesMap[image.catch_id]) {
            imagesMap[image.catch_id] = [];
          }
          imagesMap[image.catch_id].push(image.image_url);
        });
        const data = results.map((row) => {
          const newDate = format(row.catch_date, "dd.MM.yyyy");
          return {
            id: row.catch_id,
            username: row.username,
            species_name: row.species_name,
            weight: row.weight,
            date: newDate,
            location_province: row.location_province,
            location_city: row.location_city,
            lure_name: row.lure_name,
            images: imagesMap[row.catch_id] || [],
          };
        });
        await connection.query(totalQuery, async (err, result) => {
          connection.release();
          if (err) return res.sendStatus(500);
          const totalItems = result[0].total;
          res.json({
            page,
            perPage,
            totalItems,
            totalPages: Math.ceil(totalItems / perPage),
            data,
          });
        });
      });
    });
  });
};

module.exports = { handleFilterQuery };
