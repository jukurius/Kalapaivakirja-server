const db = require('../db');

const handleImageInsert = async (catchId, imgUrl) => {
      for (const imageUrl of imgUrl) {
        const query = 'INSERT INTO images (catch_id, image_url) VALUES (?, ?)';
        await db.promise().execute(query, [catchId, imageUrl]);
      }
  };
module.exports = { handleImageInsert };