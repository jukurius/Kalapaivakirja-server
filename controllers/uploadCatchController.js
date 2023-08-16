var express = require("express");
const app = express();
const db = require("../db");
app.use(express.json());
const userSearch = require("../helpers/userSearch");
const makerSearch = require("../helpers/makerSearch");
const colorInsert = require("../helpers/colorInsert");
const specieSearch = require("../helpers/specieSearch");
const lureInsert = require("../helpers/lureInsert");
const locationInsert = require("../helpers/locationInsert");
const weatherInsert = require("../helpers/weatherInsert");
const imageInsert = require("../helpers/imageInsert");
const imgToCloudinary = require("../helpers/imgToCloudinary");

const handleUploadCatch = async (req, res) => {
  const specie = req.body.specie || undefined; // musthave c
  console.log(specie)
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
  const user = req.user.user;
  console.log(user)

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
    const maker_id = await makerSearch.handleMakerSearch(lure);
    const color_id = await colorInsert.handleColorInsert(
      lureColorOne,
      lureColorTwo,
      lureColorThree
    );
    const species_id = await specieSearch.handleSpecieSearch(specie);
    const lure_id = await lureInsert.handleLureInsert(maker_id, color_id, lureLength);
    const location_id = await locationInsert.handleLocationInsert(
      locationProvince,
      locationCity,
      locationLake
    );
    const weather_id = await weatherInsert.handleWeatherInsert(
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
    const user_id = await userSearch.handleUserSearch(user);
    const img_urls = await imgToCloudinary.handleCloudinaryUp(images);
    // Now you have the IDs from the first three inserts, use them in the final insert
    const catchQuery =
      "INSERT INTO fish_catch (user_id, species_id, lure_id, location_id, weather_id, catch_date, catch_depth, weight, length, fishing_style) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const catchData = [user_id, species_id, lure_id, location_id, weather_id, catch_date, catch_depth, weight, length, fishing_style];

    const [catchResult] = await db.promise().execute(catchQuery, catchData);
    await imageInsert.handleImageInsert(catchResult.insertId, img_urls);
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = { handleUploadCatch };
