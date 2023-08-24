var express = require('express');
const app = express();
const mysql = require('mysql2/promise'); // Import mysql2/promise
const db = require('../db'); 
app.use(express.json());
require('dotenv').config();
const jwt = require('jsonwebtoken');
const generateAccessToken = require('../utils/generateAccessToken');

// KORJATTU
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    console.log(cookies)
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    try {
        const connection = await db.promise().getConnection(); // Get a promise-based connection
        const sqlSearch = "SELECT * FROM users WHERE refresh_token = ?";
        const [result] = await connection.execute(sqlSearch, [refreshToken]);

        if (result.length === 0) return res.sendStatus(403);
        const foundUser = result[0];

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || foundUser.username !== decoded.user) return res.sendStatus(403);
                const accessToken = generateAccessToken({ user: decoded.user });
                res.json({ user: decoded.user, token: accessToken, img: foundUser.image });
            }
        );

        connection.release(); // Release the connection
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

module.exports = { handleRefreshToken };