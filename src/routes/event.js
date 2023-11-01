const express = require('express');
const {isRequestValidated } = require('../validators/auth')

const { validateAddEventRequest } = require('../validators/event');
const { addevent, addfood, addDecor, getResponses, getEvents, registerResponses, acceptBid, checkedOutBid, getEvent } = require('../controller/event');
const { validateAddFoodRequest } = require('../validators/addfood');
const router = express.Router()


router.post('/add-event', validateAddEventRequest, isRequestValidated, addevent); 

router.patch('/event-food/:id', validateAddFoodRequest, isRequestValidated, addfood); 

router.patch('/event-decor/:id',
 //validateAddDecorRequest, isRequestValidated, 
 addDecor); 

router.get('/get-responses/:id', getResponses);
router.post('/register-response/:id', registerResponses);
router.patch('/accept-bid/:id', acceptBid);
router.get('/events', getEvents);
router.get('/event/:id', getEvent);

module.exports = router