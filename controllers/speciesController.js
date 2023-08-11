var express = require("express");
const app = express();
const db = require("../db");
app.use(express.json());

const handleSpecies = async (req, res) => {
  try {
    const connection = await db.promise().getConnection();
    const sqlSearch =
      "SELECT species_id AS id, species_name AS value FROM species";
    const [results] = await connection.execute(sqlSearch); // Use execute method
    res.json(results);
    connection.release(); // Release the connection
  } catch (error) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { handleSpecies };
