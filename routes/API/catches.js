const express = require('express');
const router = express.Router();
const testi = require('../../controllers/filterAndPaginatePostsController');

router.get('/', testi.paginateCatches);

module.exports = router;