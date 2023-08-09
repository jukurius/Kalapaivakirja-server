var express = require('express');
const app = express();
const mysql = require("mysql")
const bcrypt = require("bcrypt")
const db = require('../db');
app.use(express.json());

const handleNewUser = async (req, res) => {

    // Check if request have "must have" params
    if (!req.body.username || !req.body.password || !req.body.email) return res.status(400).json({ error: 'Invalid username, password or email' })

    // GET data from request body
    const user = req.body.username;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const age = req.body.age;
    const email = req.body.email;

    db.getConnection(async (err, connection) => {
        if (err) throw (err)
        const sqlSearch = "SELECT * FROM users WHERE username = ?"
        const search_query = mysql.format(sqlSearch, [user])
        const sqlInsert = "INSERT INTO users (user_id, username, password, firstname, lastname, age, email) VALUES (0,?,?,?,?,?,?)"
        const insert_query = mysql.format(sqlInsert, [user, hashedPassword, firstname, lastname, age, email])

        await connection.query(search_query, async (err, result) => {
            if (err) throw (err)
            if (result.length != 0) {
                connection.release()
                return res.status(409).json({ error: "username already exists" });
            }
            else {
                await connection.query(insert_query, (err, result) => {
                    connection.release()
                    if (err) throw (err)
                    res.status(201).json({ message: "User created successfully"});
                })
            }
        })
    })
}

module.exports = { handleNewUser };