var express = require("express");
const app = express();
const db = require("../db");
app.use(express.json());
const { format } = require("date-fns");

const handleUsers = async (req, res) => {
  const searchTerm = req.query.q;
  try {
    const connection = await db.promise().getConnection();
    if (searchTerm) {
      const sanitizedSearchTerm = `%${searchTerm}%`;
      const sqlSearch = `
      SELECT
      user_id, username, image, user_created, experience, fishing_method,
      (SELECT COUNT(*) FROM fish_catch_database.fish_catch o WHERE o.user_id = user_id) AS record_count
      FROM
      fish_catch_database.users u
      WHERE
      user_id = 1; `;

      const [results] = await connection.execute(sqlSearch, [
        sanitizedSearchTerm,
      ]);
      const data = results.map((row) => {
        let newDate;
        newDate = format(row.user_created, "dd.MM.yyyy");
        return {
          id: row.user_id,
          username: row.username,
          created: newDate,
          image: row.image,
          experience: row.experience,
          fishingMethod: row.fishing_method,
          postCount: row.record_count,
        };
      });
      res.json(data);
    } else {
      const sqlSearch = `
      SELECT
      u.user_id, username, image, user_created, experience, fishing_method,
      COUNT(o.user_id) AS record_count
      FROM
      fish_catch_database.users u
      LEFT JOIN
      fish_catch_database.fish_catch o
      ON
      u.user_id = o.user_id
      GROUP BY
      u.user_id;
      `;
      const [results] = await connection.execute(sqlSearch);
      const data = results.map((row) => {
        let newDate;
        newDate = format(row.user_created, "dd.MM.yyyy");
        return {
          id: row.user_id,
          username: row.username,
          created: newDate,
          image: row.image,
          experience: row.experience,
          fishingMethod: row.fishing_method,
          postCount: row.record_count,
        };
      });
      res.json(data);
    }
    await connection.release(); // Release the connection
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = { handleUsers };
