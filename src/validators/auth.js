const {check, validationResult} = require('express-validator')


exports.validateSignupRequest = [
    check('name')
    .notEmpty()
    .withMessage('name is required'),

    check('email')
    .isEmail()
    .withMessage( 'Valid Email is required'),

    check('contact')
    .isNumeric()
    .withMessage( 'Valid contact is required'),

    check( 'password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 character long')

]
exports.validateAdminSignupRequest = [
    check('name')
    .notEmpty()
    .withMessage('name is required'),

    check('email')
    .isEmail()
    .withMessage( 'Valid Email is required'),
    
    check('contact')
    .isNumeric()
    .withMessage( 'Valid Contact is required'),
    
    check('services')
    .isArray()
    .withMessage( 'Services are missing is required'),

    check( 'password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 character long')

]


exports.validateSigninRequest = [
    
    check('email')
    .isEmail()
    .withMessage( 'Valid Email is required'),

    check( 'password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 character long')

]

exports.isRequestValidated = (req,res,next) => {

    const errors = validationResult(req)

    if(errors.array().length > 0 ){

        return res.status(400).json({error: errors.array()[0].msg })
    }
    next()
}
