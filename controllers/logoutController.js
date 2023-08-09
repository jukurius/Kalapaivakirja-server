var express = require('express');
const app = express();
const mysql = require("mysql")
const db = require('../db'); 
app.use(express.json());
require("dotenv").config()

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    db.getConnection(async (err, connection) => {
        if (err) res.sendStatus(500);
        const sqlSearch = 'SELECT * FROM users WHERE refresh_token = ?'
        const search_query = mysql.format(sqlSearch, [refreshToken]);
        await connection.query(search_query, async (err, result) => {
            if (err) return res.sendStatus(500);
            if (result.length == 0) {
                res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                return res.sendStatus(204);
            }
            const foundUser = result[0];
            const sqlUpdate = 'UPDATE users SET refresh_token = ? WHERE username = ?'
            const update_query = mysql.format(sqlUpdate, [null, foundUser.username]);
            await connection.query(update_query, async (err, result) => {
                connection.release();
                if (err) return res.sendStatus(500);
                res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                res.sendStatus(204);
            })
        })
    })
}

module.exports = { handleLogout }