const {check, validationResult} = require('express-validator')


exports.validateAddEventRequest = [
    check('type')
    .notEmpty()
    .withMessage('type is required'),

    check('date')
    .isString()
    .isLength({min: 6})
    .withMessage( 'Valid date is required'),
    
    check('time')
    .isString()
    .isLength({min: 3})
    .withMessage( 'Valid time is required'),
    
    check('guests')
    .isNumeric()
    .withMessage( 'Enter guests in number'),
    
    check('venue')
    .isString()
    .withMessage( 'Valid Venue name is required'),
    
    check( 'budget')
    .isNumeric()
    .withMessage('Enter proper budget value'),
    
    check('postedBy')
    .isString()
    .withMessage( 'Valid email is required'),

]


