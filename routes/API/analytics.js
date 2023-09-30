const express = require('express');
const router = express.Router();
const testi = require('../../controllers/analyticsController.js');

router.get('/', testi.handleAnalytics);

module.exports = router;