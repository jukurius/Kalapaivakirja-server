const express = require('express');
const router = express.Router();
const comment = require('../../controllers/addCommentController');
const checkAuth = require('../../utils/checkAuth');

router.post('/', checkAuth, comment.handleCommentPost);

module.exports = router;