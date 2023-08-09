const express = require('express');
const router = express.Router();
const filterCatchQuery = require('../../controllers/filterCatchQueryController');

router.get('/', filterCatchQuery.handleFilterQuery);

module.exports = router;