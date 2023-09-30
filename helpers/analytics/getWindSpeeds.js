const db = require("../../db");

function getValueCount(array) {
    var temporaryArr = {};
    for (var i = 0; i < array.length; i++) {
      var obj = array[i];
      var value = obj.wind;
      if (temporaryArr[value] === undefined) {
        temporaryArr[value] = 1;
      } else {
        temporaryArr[value]++;
      }
    }
    var finalArr = [];
    for (var key in temporaryArr) {
      if (temporaryArr.hasOwnProperty(key)) {
        finalArr.push({ value: parseInt(key), count: temporaryArr[key] });
      }
    }
    for (var i = 1; i <= 30; i++) {
      if (!temporaryArr[i]) {
        finalArr.push({ value: i, count: 0 });
      }
    }
  
    // Järjestetään finalArr arvon mukaan
    finalArr.sort(function (a, b) {
      return a.value - b.value;
    });
  
    return finalArr;
  }

const handleWindSpeeds = async (specie) => {
  const query =
    "SELECT wind FROM fish_catch_database.fish_catch join weather on fish_catch.weather_id = weather.weather_id join species on fish_catch.species_id = species.species_id where species_name = ?";
  const [result] = await db.promise().execute(query, [specie]);
  if (result.length === 0) {
    return result;
  }
  var newArr = getValueCount(result);
  return newArr;
};

module.exports = { handleWindSpeeds};