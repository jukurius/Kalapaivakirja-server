const db = require("../../db");

const handleConditions = (data) => {
  const labels = data.map((item) => {
    return item.weather_condition;
  });
  const uniques = Array.from(new Set(labels));
  const counts = {};
  for (let i = 0; i < uniques.length; i++) {
    const label = uniques[i];
    for (let j = 0; j < labels.length; j++) {
      const element = labels[j];
      if (element === label) {
        counts[label] = (counts[label] || 0) + 1;
      }
    }
  }
  const colors = {
    Aurinkoinen: "khaki",
    Pilvinen: "azure",
    Poutainen: "orange",
    Sateinen: "deepskyblue",
    Lumisade: "gray",
    Räntäsade: "lightblue",
    Tuulinen: "black",
    Sumuinen: "silver",
    Myrskyinen: "black",
    Ukkonen: "darkslateblue"
  }

  const loopColors = (value) => {
    for (const key in colors) {
        if (Object.hasOwnProperty.call(colors, key)) {
            if (key === value) { 
                return colors[key];
            }
        }
    }
  }
  const uniqueItems = Object.keys(counts);
  const result = uniqueItems.map((item) => ({
    value: item,
    count: counts[item],
    colorCode: loopColors(item),
  }));
  return result;
};

const handleWeatherData = async (specie) => {
  const query =
    "SELECT weather_condition, air_temperature, water_tempature, wind FROM fish_catch_database.fish_catch join weather on fish_catch.weather_id = weather.weather_id join species on fish_catch.species_id = species.species_id where species_name = ?";
  const [result] = await db.promise().execute(query, [specie]);
  const formedData = handleConditions(result);
  return formedData;
};

module.exports = { handleWeatherData };
