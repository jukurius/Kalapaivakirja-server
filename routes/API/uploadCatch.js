const express = require('express');
const router = express.Router();
const uploadCatchController = require('../../controllers/uploadCatchController');
const checkAuth = require('../../utils/checkAuth');

router.post('/', checkAuth, uploadCatchController.handleUploadCatch);

module.exports = router;