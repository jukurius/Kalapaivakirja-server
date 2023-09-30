const express = require('express');
const router = express.Router();
const postsByUserController = require('../../controllers/postsByUserController');

router.get('/', postsByUserController.handlePostsByUser);

module.exports = router;