var express = require('express');
const app = express();
const db = require('../db');
app.use(express.json());
require("dotenv").config()

//TOIMII
const handleLogout = async (req, res) => {
    // On client, also delete the accessToken
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;
    // Is refreshToken in db?
    try {
        const connection = await db.promise().getConnection();
        const sqlSearch = 'SELECT * FROM users WHERE refresh_token = ?'
        const [result] = await connection.execute(sqlSearch, [refreshToken]); // Use execute method
        if (result.length == 0) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            return res.sendStatus(204);
        }
        const foundUser = result[0];
        const sqlUpdate = 'UPDATE users SET refresh_token = ? WHERE username = ?'
        const [update] = await connection.execute(sqlUpdate, [null, foundUser.username]); // Use execute method
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.sendStatus(204);
        connection.release(); // Release the connection
    } catch (error) {
        console.error(err);
        res.sendStatus(500);
    }
}

module.exports = { handleLogout }