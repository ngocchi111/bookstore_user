const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

/* GET list of books. */
router.get('/', bookController.index);

router.get('/detail/:id', bookController.details);

router.post('/detail/:id', bookController.addCmt);

router.get('/addToCart/:id', bookController.addToCart);

router.post('/addToCart/:id', bookController.postCart);

module.exports = router;