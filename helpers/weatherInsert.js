const db = require('../db');

const handleWeatherInsert = async (condition, airTemp, waterTemp, wind) => {
    const query =
      "INSERT INTO weather(weather_condition, air_temperature, water_tempature, wind) VALUES (?, ?, ?, ?)";
    const [result] = await db
      .promise()
      .execute(query, [condition, airTemp, waterTemp, wind]);
    return result.insertId;
  };

module.exports = { handleWeatherInsert };