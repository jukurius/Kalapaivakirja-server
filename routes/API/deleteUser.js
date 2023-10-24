const express = require('express');
const router = express.Router();
const deleteUserController = require('../../controllers/deleteUserController');
const checkAuth = require('../../utils/checkAuth');

router.delete('/', checkAuth, deleteUserController.handleUserDelete);

module.exports = router;