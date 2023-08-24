const cloudinary = require('../cloudinary');

const handleCloudinaryUp = async (imgs) => {
  const cloudinaryUploadPromises = imgs.map(async (file) => {
    const result = await cloudinary.uploader.upload(file, {
      folder: "Kalapaivakirja/uploads",
      resource_type: "auto",
      height: 920,
      crop: "scale"
    });
    return result.secure_url;
  });

  const uploadedUrls = await Promise.all(cloudinaryUploadPromises);
  console.log(uploadedUrls)
  return uploadedUrls;
};
module.exports = { handleCloudinaryUp };
