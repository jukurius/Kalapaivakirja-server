const datauri = require('datauri');
const path = require('node:path');
const dUri = new datauri();

const handleDataURI = async (imgs) => {
  try {
    const formattedImage = dUri.format(path.extname(imgs.originalname).toString(), imgs.buffer);
    const dataUriString = formattedImage.content;
    return dataUriString;
  } catch (error) {
    console.error("Data URI conversion error:", error);
    throw error; // Re-throw the error to be caught by the caller
  }
};

module.exports = { handleDataURI };