const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

/* GET list of books. */
router.get('/', cartController.cart);

router.get('/detail/:id', cartController.detail);

router.post('/detail/:id', cartController.update);

router.get('/pay', cartController.pay);

router.post('/pay', cartController.payNow)

module.exports = router;