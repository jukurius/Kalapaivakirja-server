const db = require('../db');

const handleMakerSearch = async (data) => {
    const query = "SELECT maker_id FROM lure_maker WHERE maker_name = ?";
    const [result] = await db.promise().execute(query, [data]);
    return result[0].maker_id;
};

module.exports = { handleMakerSearch };