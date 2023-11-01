const express = require('express');
const { createCheckout, paymentNotification, checkedOutBid } = require('../controller/payment');
const router = express.Router()


router.post('/create-checkout-session',  createCheckout);
router.patch('/checkedout/:eventId/:companyId', checkedOutBid);
// router.post('/send-email', sendEmail);
// express.raw({type: 'application/json'}),

module.exports = router
