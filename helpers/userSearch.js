const db = require("../db");
const handleUserSearch = async (username) => {
    const query = "SELECT user_id FROM users WHERE username = ?";
    const [result] = await db.promise().execute(query, [username]);
    return result[0].user_id;
};

module.exports = { handleUserSearch };
