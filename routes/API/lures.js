const express = require('express');
const router = express.Router();
const luresController = require('../../controllers/luresController');

router.get('/', luresController.handleLures);

module.exports = router;