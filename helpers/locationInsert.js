const db = require('../db');

const handleLocationInsert = async (province, city, lake, lat, lng) => {
    const query =
        "INSERT INTO locations(location_province, location_city, location_lake, latitude, longitude) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.promise().execute(query, [province, city, lake, lat, lng]);
    return result.insertId;
};

module.exports = { handleLocationInsert };