const express = require('express');
const { createCheckout, paymentNotification } = require('../controller/payment');
const router = express.Router()


router.post('/create-checkout-session',  createCheckout);
router.post('/webhook',  paymentNotification);
// express.raw({type: 'application/json'}),

module.exports = router
