var express = require("express");
const app = express();
const mysql = require("mysql");
const db = require("../db");
app.use(express.json());
const cloudinary = require("cloudinary").v2;

const handleMakerSearch = async (data) => {
  const query = "SELECT maker_id FROM lure_maker WHERE maker_name = ?";
  const [result] = await db.promise().execute(query, [data]);
  return result[0].maker_id;
};
const handleColorInsert = async (one, two, three) => {
  const query =
    "INSERT INTO lure_color (color_first, color_second, color_third) VALUES (?, ?, ?)";
  const [result] = await db.promise().execute(query, [one, two, three]);
  return result.insertId;
};
const handleSpecieSearch = async (data) => {
  const query = "SELECT species_id FROM species WHERE species_name = ?";
  const [result] = await db.promise().execute(query, [data]);
  return result[0].species_id;
};
const handleLureInsert = async (makerId, colorId, size) => {
  const query = "INSERT INTO lures(maker_id, color_id, size) VALUES (?, ?, ?)";
  const [result] = await db.promise().execute(query, [makerId, colorId, size]);
  return result.insertId;
};
const handleLocationInsert = async (province, city, lake) => {
  const query =
    "INSERT INTO locations(location_province, location_city, location_lake) VALUES (?, ?, ?)";
  const [result] = await db.promise().execute(query, [province, city, lake]);
  return result.insertId;
};
const handleWeatherInsert = async (condition, airTemp, waterTemp, wind) => {
  const query =
    "INSERT INTO weather(weather_condition, air_temperature, water_tempature, wind) VALUES (?, ?, ?, ?)";
  const [result] = await db
    .promise()
    .execute(query, [condition, airTemp, waterTemp, wind]);
  return result.insertId;
};
const handleImageInsert = async (catchId, imgUrl) => {
  try {
    for (const imageUrl of imgUrl) {
      const query = 'INSERT INTO images (catch_id, image_url) VALUES (?, ?)';
      const [result] = await db.promise().execute(query, [catchId, imageUrl]);
    }
  } catch (error) {
    console.error('Error inserting images:', error);
  }
};

const handleUploadCatch = async (req, res) => {
  const specie = req.body.specie || undefined; // musthave c
  const specieWeight = req.body.specieWeight || undefined; // musthave c
  const specieLength = req.body.specieLength || null;
  const lure = req.body.lure || undefined; // musthave c
  const lureColorOne = req.body.lureColorOne || undefined; // musthave c
  const lureColorTwo = req.body.lureColorTwo || null;
  const lureColorThree = req.body.lureColorThree || null;
  const lureLength = req.body.lureLength || null;
  const depth = req.body.depth || null;
  const locationProvince = req.body.locationProvince || undefined; // musthave object id value
  const locationCity = req.body.locationCity || undefined; // musthave string
  const locationLake = req.body.locationLake || null;
  const fishingStyle = req.body.fishingStyle || undefined; // musthave string
  const images = req.body.images || undefined; // musthave c
  const weatherCondition = req.body.weatherCondition || undefined; // musthave string
  const airTemp = req.body.airTemp || null;
  const waterTemp = req.body.waterTemp || null;
  const wind = req.body.wind || null;
  const catchDate = req.body.catchDate || null;
  const user = 1; //req.user;

  if (
    !specie ||
    !specieWeight ||
    !lure ||
    !lureColorOne ||
    !locationProvince ||
    !locationCity ||
    !fishingStyle ||
    !images
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const maker_id = await handleMakerSearch(lure);
    const color_id = await handleColorInsert(
      lureColorOne,
      lureColorTwo,
      lureColorThree
    );
    const species_id = await handleSpecieSearch(specie);
    const lure_id = await handleLureInsert(maker_id, color_id, lureLength);
    const location_id = await handleLocationInsert(
      locationProvince,
      locationCity,
      locationLake
    );
    const weather_id = await handleWeatherInsert(
      weatherCondition,
      airTemp,
      waterTemp,
      wind
    );
    const catch_date = catchDate;
    const catch_depth = depth;
    const weight = specieWeight;
    const length = specieLength;
    const fishing_style = fishingStyle;
    const user_id = user;

    console.log("depth", catch_depth)
    // Now you have the IDs from the first three inserts, use them in the final insert
    const catchQuery =
      "INSERT INTO fish_catch (user_id, species_id, lure_id, location_id, weather_id, catch_date, catch_depth, weight, length, fishing_style) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const catchData = [user_id, species_id, lure_id, location_id, weather_id, catch_date, catch_depth, weight, length, fishing_style];

    const [catchResult] = await db.promise().execute(catchQuery, catchData);
    handleImageInsert(catchResult.insertId, images);
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = { handleUploadCatch };
