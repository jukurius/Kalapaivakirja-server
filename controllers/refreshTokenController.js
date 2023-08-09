var express = require('express');
const app = express();
const mysql = require("mysql")
const db = require('../db'); 
app.use(express.json());
require('dotenv').config();
const jwt = require('jsonwebtoken');
const generateAccessToken = require("../utils/generateAccessToken")

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    console.log(cookies)
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    db.getConnection(async (err, connection) => {
        if (err) return res.sendStatus(500);
        const sqlSearch = "SELECT * FROM users WHERE refresh_token = ?"
        const search_query = mysql.format(sqlSearch, [refreshToken])

        await connection.query(search_query, async (err, result) => {
            if (err) return res.sendStatus(500);
            if (result.length == 0) return res.sendStatus(403)
            const foundUser = result[0];

            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err, decoded) => {
                    if (err || foundUser.username !== decoded.user) return res.sendStatus(403);
                    const accessToken = generateAccessToken({ user: decoded.username });
                    res.json({ token: accessToken })
                }
            );
        })
    })
}

module.exports = { handleRefreshToken }