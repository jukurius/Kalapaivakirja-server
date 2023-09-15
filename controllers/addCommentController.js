var express = require("express");
const app = express();
const db = require("../db");
app.use(express.json());

const handleCommentPost = async (req, res) => {
    const user = req.user.user;
    const catchId = req.body.catchId;
    const comment_content = req.body.commentContent;
    if (!user || !comment_content || !catchId) res.sendStatus(400);
    console.log(user);
    console.log(catchId);
    console.log(comment_content);
    try {
        const connection = await db.promise().getConnection();
        const userQuery = "SELECT user_id FROM users WHERE username = ?";
        const [userId] = await connection.execute(userQuery, [user]);
        if (!userId.length) res.sendStatus(401);
        const id = userId[0].user_id;
        const commentInsertQuery = "INSERT INTO comments (user_id, catch_id, comment_content) VALUES (?, ?, ?)";
        const [result] = await connection.execute(commentInsertQuery, [id, catchId, comment_content]); // Use execute method
        res.json(result);
        connection.release(); // Release the connection
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

module.exports = { handleCommentPost };