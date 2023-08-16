const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});

const handleCloudinaryUp = async (imgs) => {
  const cloudinaryUploadPromises = imgs.map(async (file) => {
    const result = await cloudinary.uploader.upload(file, {
      folder: "Kalapaivakirja/uploads",
      resource_type: "auto",
      width: 800,
      crop: "scale"
    });
    return result.secure_url;
  });

  const uploadedUrls = await Promise.all(cloudinaryUploadPromises);
  console.log(uploadedUrls)
  return uploadedUrls;
};
module.exports = { handleCloudinaryUp };
