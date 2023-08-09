const express = require('express');
const router = express.Router();
const latestPostsController = require('../../controllers/latestPostsController')

router.get('/', latestPostsController.handleLatestPosts);

module.exports = router;