const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

/* GET list of books. */
router.get('/', bookController.index);
router.get('/:id', bookController.details);

module.exports = router;