const express = require('express');
const app = express();
const { format } = require('date-fns');

// Require your database connection pool from '../db'
const db = require('../db');

app.use(express.json());

const handleFilterQuery = async (req, res) => {
    const filters = req.query;
    console.log(filters);
    const page = parseInt(filters.page) || 1;
    const perPage = 20;
    const startIndex = (page - 1) * perPage;
    const filterConditions = [];
    const filterValues = [];
  
    for (const key in filters) {
        if (filters.hasOwnProperty(key) && key !== 'page') {
          const { filterType, filterArr } = filters[key];
          if (filterArr && filterArr.length > 0) {
            const placeholders = filterArr.map(() => `${filterType} = ?`).join(' OR ');
            filterConditions.push(`(${placeholders})`);
            filterValues.push(...filterArr);
          }
        }
      }
    
      let whereClause = '';
    
      if (filterConditions.length > 0) {
        whereClause = 'WHERE ' + filterConditions.join(' AND ');
      }
    try {
      const connection = await db.promise().getConnection();
  
      const sqlSearch = `
        SELECT catch_id, username, species_name, weight, catch_date, location_province, location_city
        FROM fish_catch
        JOIN users ON fish_catch.user_id = users.user_id
        JOIN species ON fish_catch.species_id = species.species_id
        JOIN lures ON fish_catch.lure_id = lures.lure_id
        JOIN lure_maker ON lures.maker_id = lure_maker.maker_id
        JOIN locations ON fish_catch.location_id = locations.location_id
        JOIN weather ON fish_catch.weather_id = weather.weather_id
        ${whereClause}
        LIMIT ?, ?
      `;
  
      const searchQueryParams = filterValues.length > 0 ? [...filterValues, startIndex, perPage] : [startIndex, perPage];
      console.log('Executing query:', sqlSearch);
      console.log('Query parameters:', searchQueryParams);
      const [results] = await connection.query(sqlSearch, searchQueryParams);
  
      const catchIds = results.map((item) => item.catch_id);

      if (catchIds.length > 0) {
        const catchIdPlaceholders = catchIds.map(() => '?').join(',');
        const sqlImgs = `
          SELECT catch_id, image_url
          FROM images
          WHERE catch_id IN (${catchIdPlaceholders})
        `;
      
        const [imgResult] = await connection.execute(sqlImgs, catchIds);
      
        const imagesMap = {};
        imgResult.forEach((image) => {
          if (!imagesMap[image.catch_id]) {
            imagesMap[image.catch_id] = [];
          }
          imagesMap[image.catch_id].push(image.image_url);
        });
      
        const data = results.map((row) => {
          let newDate;
          if (row.catch_date !== null) {
            newDate = format(row.catch_date, 'dd.MM.yyyy');
          }
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
  
      const sqlTotalQuery = `
        SELECT COUNT(*) AS total 
        FROM fish_catch 
        JOIN users ON fish_catch.user_id = users.user_id 
        JOIN species ON fish_catch.species_id = species.species_id 
        JOIN locations ON fish_catch.location_id = locations.location_id 
        JOIN lures ON fish_catch.lure_id = lures.lure_id 
        JOIN lure_maker ON lures.maker_id = lure_maker.maker_id
        ${whereClause}
      `;
  
      const [result] = await connection.execute(sqlTotalQuery, filterValues);
      const totalItems = result[0].total;
  
      res.json({
        page,
        perPage,
        totalItems,
        totalPages: Math.ceil(totalItems / perPage),
        data,
      })};
  
      connection.release();
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  };
  
  module.exports = { handleFilterQuery };