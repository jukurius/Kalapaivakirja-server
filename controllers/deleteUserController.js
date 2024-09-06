var express = require("express");
const app = express();
const db = require("../db");
app.use(express.json());

const handleUserDelete = async (req, res) => {
    const username = req.query.username;
    const usr = req.user.user

    if (username !== usr || !username) return res.sendStatus(400);
        
    try {
      const connection = await db.promise().getConnection();
      const sqlSearch =
        "SELECT * FROM fish_catch_database.fish_catch where user_id = (SELECT user_id from fish_catch_database.users where username = ?)";
      const [results] = await connection.execute(sqlSearch, [username]); // Use execute method
      if (results) {
        const sqlDelete = "DELETE FROM users WHERE username = ?";
        // await connection.execute(sqlDelete, [username]);
        res.json(results);
      } else {
        res.sendStatus(404);
      }
      connection.release(); // Release the connection
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  };
  
  module.exports = { handleUserDelete };