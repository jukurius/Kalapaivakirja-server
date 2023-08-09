var express = require("express");
const app = express();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const db = require("../db");
app.use(express.json());
require("dotenv").config();
const generateAccessToken = require("../utils/generateAccessToken");
const generateRefreshToken = require("../utils/generateRefreshToken");

const handleLogin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const user = req.body.email;
  const password = req.body.password;

  db.getConnection(async (err, connection) => {
    if (err) return res.sendStatus(500);
    const sqlSearch = "Select * from users where email = ?";
    const search_query = mysql.format(sqlSearch, [user]);
    await connection.query(search_query, async (err, result) => {
      if (err) return res.sendStatus(500);
      if (result.length == 0) return res.sendStatus(401);
      const foundUser = result[0];
      const match = await bcrypt.compare(password, foundUser.password);
      if (match) {
        const accessToken = generateAccessToken({ user: foundUser.username });
        const refreshToken = generateRefreshToken({ user: foundUser.username });

        const sqlUpdate =
          "UPDATE users SET refresh_token = ? WHERE username = ?";
        const update_query = mysql.format(sqlUpdate, [
          refreshToken,
          foundUser.username,
        ]);
        await connection.query(update_query, async (err, result) => {
          connection.release();
          if (err) return res.sendStatus(500);
          res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
          res.json({ user: foundUser.username, token: accessToken });
        });
      } else {
        res.sendStatus(401);
      }
    });
  });
};

module.exports = { handleLogin };
