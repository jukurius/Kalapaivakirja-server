var express = require("express");
const app = express();
const db = require("../db");
app.use(express.json());
const { format } = require("date-fns");

const handleComments = async (req, res) => {
    const catchId = req.query.catchId;
    
    if (!catchId) return res.sendStatus(400);
    try {
        const connection = await db.promise().getConnection();
        const sqlSearch = "select * from comments join users on comments.user_id = users.user_id where catch_id = ?";
        const [result] = await connection.execute(sqlSearch, [catchId]); // Use execute method
        const results = result.map((row) => {
            let newDate;
            newDate = format(row.comment_created, "dd.MM.yyyy");
            return {
              id: row.comment_id,
              userId: row.user_id,
              catchId: row.catch_id,
              created: newDate,
              image: row.image,
              content: row.comment_content,
              username: row.username,
              image: row.image
            };
          });
        res.json(results);
        connection.release(); // Release the connection
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

module.exports = { handleComments };