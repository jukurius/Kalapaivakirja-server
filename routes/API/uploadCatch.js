const express = require('express');
const router = express.Router();
const uploadCatchController = require('../../controllers/uploadCatchController');
const checkAuth = require('../../utils/checkAuth');
// const multer = require("multer");
// const storage = multer.memoryStorage(); // Store in memory for now
// const upload = multer({ storage: storage });

router.post('/', checkAuth, uploadCatchController.handleUploadCatch);

module.exports = router;