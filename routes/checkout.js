const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout'); // Import the checkout controller

router.post('/', checkoutController.placeOrder);

module.exports = router;
