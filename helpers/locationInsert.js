const db = require('../db');

const handleLocationInsert = async (province, city, lake) => {
    const query =
        "INSERT INTO locations(location_province, location_city, location_lake) VALUES (?, ?, ?)";
    const [result] = await db.promise().execute(query, [province, city, lake]);
    return result.insertId;
};

module.exports = { handleLocationInsert };