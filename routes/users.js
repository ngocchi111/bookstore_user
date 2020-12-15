const express = require('express');
const router = express.Router();
const homeController = require('../controllers/userController');
const userController = require('../controllers/userController');

/* GET list of books. */
router.get('/signin', userController.signin);
router.get('/signup', userController.signup);

module.exports = router;
