const db = require('../db');

const handleImageInsert = async (catchId, imgUrl) => {
    try {
      for (const imageUrl of imgUrl) {
        const query = 'INSERT INTO images (catch_id, image_url) VALUES (?, ?)';
        const [result] = await db.promise().execute(query, [catchId, imageUrl]);
      }
    } catch (error) {
      console.error('Error inserting images:', error);
    }
  };
module.exports = { handleImageInsert };