var express = require('express');
const app = express();
const bcrypt = require("bcrypt")
const db = require('../db');
app.use(express.json());

const handleNewUser = async (req, res) => {
    // Check if request have "must have" params
    if (!req.body.username || !req.body.password || !req.body.email) return res.status(400).json({ error: 'Invalid username, password or email' })

    // GET data from request body
    const user = req.body.username;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const firstname = req.body.firstname || null;
    const lastname = req.body.lastname || null;
    const age = req.body.age || null;
    const email = req.body.email || null;

    try {
        const connection = await db.promise().getConnection();
        const sqlSearch = "SELECT * FROM users WHERE username = ?"
        const sqlInsert = "INSERT INTO users (user_id, username, password, firstname, lastname, age, email) VALUES (0,?,?,?,?,?,?)"
        const [userResult] = await connection.execute(sqlSearch, [user]); // Use execute method
        if (userResult.length !== 0) {
            connection.release()
            return res.status(409).json({ error: "username already exists" });
        }
        else {
            await connection.execute(sqlInsert, [user, hashedPassword, firstname, lastname, age, email]); // Use execute method
            res.status(201).json({ message: "User created successfully" });
        }
        connection.release(); // Release the connection
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

module.exports = { handleNewUser };