var express = require("express");
const app = express();
const db = require("../db");
app.use(express.json());

// KORJATTU
const handleCityLocation = async (req, res) => {
    const locationCode = req.query.locationCode;
    console.log(locationCode);
    try {
        const connection = await db.promise().getConnection();
        const sqlSearch =
            "SELECT DISTINCT location_city AS value, location_code FROM fish_catch_database.location_data WHERE location_code = ? ORDER BY location_city ASC";
            const [result] = await connection.execute(sqlSearch, [locationCode]); // Use execute method
            const results = result.map((row, index) => {
                return {
                    id: index,
                    value: row.value,
                    code: row.location_code
                };
            });
            res.json(results);
        res.json(results);
        connection.release(); // Release the connection
      } catch (error) {
        console.error(err);
        res.sendStatus(500);
      }
};

module.exports = { handleCityLocation };