var express = require("express");
const app = express();
const db = require("../db");
app.use(express.json());

const handleUsers = async (req, res) => {
  const searchTerm = req.query.q;
  try {
    const connection = await db.promise().getConnection();
    if (searchTerm) {
      const sanitizedSearchTerm = `%${searchTerm}%`;
      const sqlSearch =
        "SELECT user_id, username, email, firstname, lastname, description, image FROM users WHERE username LIKE ?";
      const [results] = await connection.execute(sqlSearch, [
        sanitizedSearchTerm,
      ]);
      res.json(results);
    } else {
      const sqlSearch =
        "SELECT user_id, username, email, firstname, lastname, description, image FROM users";
      const [results] = await connection.execute(sqlSearch);
      res.json(results);
    }
    await connection.release(); // Release the connection
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = { handleUsers };
