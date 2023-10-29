const express = require('express');
const { adminSignup, adminSignin} = require('../../controller/Company/auth');
const { validateAdminSignupRequest, isRequestValidated, validateSigninRequest } = require('../../validators/auth');

const router = express.Router()


router.post('/register-company', validateAdminSignupRequest, isRequestValidated, adminSignup);

router.post('/signin-company', validateSigninRequest, isRequestValidated, adminSignin);



module.exports = router