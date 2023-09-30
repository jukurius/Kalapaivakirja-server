var express = require("express");
const app = express();
const db = require("../db");
app.use(express.json());
const { format } = require("date-fns");

const handleSingleUser = async (req, res) => {
    const username = req.query.username;
    if (!username) return res.sendStatus(400);
    try {
      const connection = await db.promise().getConnection();
      const sqlSearch =
        "SELECT user_id, username, user_created, image, experience, fishing_method, firstname, lastname, age, email, description FROM users WHERE username = ?";
      const [results] = await connection.execute(sqlSearch, [username]); // Use execute method
      const data = results.map((row) => {
        let newDate;
        newDate = format(row.user_created, "dd.MM.yyyy");
        return {
          id: row.user_id,
          username: row.username,
          created: newDate,
          image: row.image,
          experience: row.experience,
          fishingMethod: row.fishing_method,
          firstname: row.firstname,
          lastname: row.lastname,
          age: row.age,
          description: row.description
        };
      });
      res.json(data);
      connection.release(); // Release the connection
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  };
  
  module.exports = { handleSingleUser };
