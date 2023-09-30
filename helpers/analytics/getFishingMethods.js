const db = require("../../db");

const handleMethods = (data) => {
  const labels = data.map((item) => {
    return item.fishing_style;
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
    Heittokalastus: "blue",
    Onginta: "red",
    Pilkintä: "green",
    Perhokalastus: "orange",
    Tuulastus: "gold",
    Uistelu: "navy",
  }

  const loopColors = (value) => {
    for (const key in colors) {
        if (Object.hasOwnProperty.call(colors, key)) {
            if (key === value) { 
                console.log("löytyi")
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

const handleFishingMethods = async (specie) => {
  const query =
    "SELECT fishing_style FROM fish_catch_database.fish_catch join species on fish_catch.species_id = species.species_id where species_name = ?";
  const [result] = await db.promise().execute(query, [specie]);
  console.log(result)
  const formedData = handleMethods(result);
  console.log(formedData);
  return formedData;
};

module.exports = { handleFishingMethods };