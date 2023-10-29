const express = require('express');
const { signup, signin } = require('../controller/auth');
const {validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth')

const router = express.Router()

router.post('/register-user', validateSignupRequest, isRequestValidated, signup); 

router.post('/signin-user', validateSigninRequest, isRequestValidated, signin);



module.exports = router