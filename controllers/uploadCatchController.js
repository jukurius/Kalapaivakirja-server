var express = require("express");
const app = express();
const mysql = require("mysql");
const db = require("../db");
app.use(express.json());
const cloudinary = require('cloudinary').v2;

const handleUploadCatch = async (req, res) => {
  const specie = req.body.specie || undefined; // musthave
  const specieWeight = req.body.specieWeight || undefined; // musthave
  const specieLength = req.body.specieLength || null;
  const lure = req.body.lure || undefined; // musthave
  const lureColorOne = req.body.lureColorOne || undefined; // musthave
  const lureColorTwo = req.body.lureColorTwo || null;
  const lureColorThree = req.body.lureColorThree || null;
  const lureLength = req.body.lureLength || null;
  const locationProvince = req.body.locationProvince.value || undefined; // musthave
  const locationCity = req.body.locationCity || undefined; // musthave
  const fishingStyle = req.body.fishingStyle || undefined; // musthave
  const images = req.body.images || undefined; // musthave

  if (!specie || !specieWeight || !lure || !lureColorOne || !locationProvince || !locationCity || !fishingStyle || !images) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  db.getConnection(async (err, connection) => {
  });
};

module.exports = { handleUploadCatch };