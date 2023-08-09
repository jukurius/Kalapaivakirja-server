const express = require('express');
const router = express.Router();
const speciesController = require('../../controllers/speciesController');

router.get('/', speciesController.handleSpecies);

module.exports = router;