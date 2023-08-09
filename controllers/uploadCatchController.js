var express = require("express");
const app = express();
const mysql = require("mysql");
const db = require("../db");
app.use(express.json());
const cloudinary = require('cloudinary').v2;

const handleUploadCatch = async (req, res) => {

  db.getConnection(async (err, connection) => {
  });
};

module.exports = { handleUploadCatch };