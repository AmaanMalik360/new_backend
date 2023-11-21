const express = require('express');
const {isRequestValidated } = require('../validators/auth')

const { validateAddEventRequest } = require('../validators/event');
const { addevent, addfood, addDecor, getResponses, getEvents, registerResponses, acceptBid, getEvent, updateBid, completed, getCompleted, getCompletedCompany, rejectBid } = require('../controller/event');
const { validateAddFoodRequest } = require('../validators/addfood');
const router = express.Router()


router.post('/add-event', 
// validateAddEventRequest, 
// isRequestValidated, 
addevent); 

router.patch('/event-food/:id', validateAddFoodRequest, isRequestValidated, addfood); 

router.patch('/event-decor/:id',
 //validateAddDecorRequest, isRequestValidated, 
 addDecor); 

router.get('/get-responses/:id', getResponses);
router.post('/register-response/:id', registerResponses);
router.patch('/accept-bid/:id', acceptBid); // for user 
router.patch('/reject-bid/:id', rejectBid);  
router.patch('/update-bid/:id', updateBid); // for company
router.patch('/completed/:id', completed); // by user

router.get('/events', getEvents); // for companies to see the posted events

router.get('/completed-events/:id', getCompleted);// user
router.get('/completed-events-company/:id', getCompletedCompany);// company

router.get('/event/:id', getEvent);



module.exports = router