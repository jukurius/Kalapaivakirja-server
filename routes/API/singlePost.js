const express = require('express');
const router = express.Router();
const singlePost = require('../../controllers/singlePostController');
const checkAuth = require('../../utils/checkAuth');

router.get('/',checkAuth, singlePost.handleSinglePost);

module.exports = router;