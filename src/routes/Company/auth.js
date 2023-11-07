const express = require('express');
const { adminSignup, adminSignin, getCompany} = require('../../controller/Company/auth');
const { validateAdminSignupRequest, isRequestValidated, validateSigninRequest } = require('../../validators/auth');

const router = express.Router()


router.post('/register-company', validateAdminSignupRequest, isRequestValidated, adminSignup);

router.post('/signin-company', validateSigninRequest, isRequestValidated, adminSignin);

router.get('/get-company/:id', getCompany)


module.exports = router