const express = require('express');
const router = express.Router();
const locationController = require('../../controllers/locationController');

router.get('/', locationController.handleLocations);

module.exports = router;