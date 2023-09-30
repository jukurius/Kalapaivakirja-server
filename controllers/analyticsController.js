var express = require("express");
const app = express();
const db = require("../db");
app.use(express.json());
const getWeatherData = require('../helpers/analytics/getWeatherData');
const getAirTemps = require('../helpers/analytics/getAirTemps');
const getWaterTemps = require('../helpers/analytics/getWaterTemps');
const getWindSpeeds = require('../helpers/analytics/getWindSpeeds');
const getFishingMethods = require('../helpers/analytics/getFishingMethods');
const getSingleColoredLures = require('../helpers/analytics/getSingleColoredLures');

const handleAnalytics = async (req, res) => {
  const specie = req.query.specie;
  if (!specie) return res.sendStatus(400);
  try {
    const weather = await getWeatherData.handleWeatherData(specie);
    const airTemps = await getAirTemps.handleAirTemps(specie);
    const waterTemps = await getWaterTemps.handleWaterTemps(specie);
    const windSpeeds = await getWindSpeeds.handleWindSpeeds(specie);
    const fishingMethods = await getFishingMethods.handleFishingMethods(specie);
    const singleColoredLures = await getSingleColoredLures.handleSingleColoredLures(specie);
    const data = {
      weather: {
        conditions: weather,
        airTemps: airTemps,
        waterTemps: waterTemps,
        windSpeeds: windSpeeds,
        fishingMethods: fishingMethods,
        singleColoredLures: singleColoredLures,
      }
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = { handleAnalytics };
