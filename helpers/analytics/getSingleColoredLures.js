const db = require("../../db");

const handleConditions = (data) => {
  var labels = [];
  for (let i = 0; i < data.length; i++) {
    const obj = data[i];
    for (const key in obj) {
      if (obj[key] !== null) {
        labels.push(obj[key]);
      }
    }
  }
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
    Sininen: "blue",
    Punainen: "red",
    Vihreä: "green",
    Oranssi: "orange",
    Keltainen: "yellow",
    Violetti: "purple",
    Musta: "black",
    Hopea: "silver",
    Kultainen: "gold",
    Pinkki: "pink",
    Valkoinen: "beige"
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

const handleSingleColoredLures = async (specie) => {
  const query =
    "SELECT color_first, color_second, color_third FROM fish_catch_database.fish_catch join lures on fish_catch.lure_id = lures.lure_id join lure_color on lures.color_id = lure_color.color_id join species on fish_catch.species_id = species.species_id where species_name = ?";
  const [result] = await db.promise().execute(query, [specie]);
  console.log(result)
  const formedData = handleConditions(result);
  return formedData;
};

module.exports = { handleSingleColoredLures };
