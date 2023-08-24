var express = require('express');
const app = express();
const mysql = require('mysql2/promise'); // Import mysql2/promise
const db = require('../db'); 
app.use(express.json());
const { format } = require('date-fns'); 

// KORJATTU
const handleLatestPosts = async (req, res) => {
    try {
        const connection = await db.promise().getConnection(); // Get a promise-based connection
        const sqlSearch = `
            SELECT catch_id, username, species_name, weight, catch_date, location_province, location_city
            FROM fish_catch
            JOIN users ON fish_catch.user_id = users.user_id
            JOIN species ON fish_catch.species_id = species.species_id
            JOIN locations ON fish_catch.location_id = locations.location_id
            ORDER BY catch_id DESC LIMIT 16
        `;
        const [results] = await connection.execute(sqlSearch); // Use execute method

        const catchIds = results.map((item) => item.catch_id);
        const sqlImgs = `
            SELECT catch_id, image_url
            FROM images
            WHERE catch_id IN (${catchIds.join(',')})
        `;

        const [imgResult] = await connection.execute(sqlImgs); // Use execute method

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
                newDate = format(item.catch_date, 'dd.MM.yyyy');
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

module.exports = { handleLatestPosts };