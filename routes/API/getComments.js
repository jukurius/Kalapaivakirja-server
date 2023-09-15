const express = require('express');
const router = express.Router();
const comments = require('../../controllers/commentController');

router.get('/', comments.handleComments);

module.exports = router;