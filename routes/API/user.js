const express = require('express');
const router = express.Router();
const singleUserController = require('../../controllers/singleUserController');

router.get('/', singleUserController.handleSingleUser);

module.exports = router;