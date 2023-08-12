const db = require('../db');

const handleSpecieSearch = async (data) => {
    const query = "SELECT species_id FROM species WHERE species_name = ?";
    const [result] = await db.promise().execute(query, [data]);
    return result[0].species_id;
  };

module.exports = { handleSpecieSearch };