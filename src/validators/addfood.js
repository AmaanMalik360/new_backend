const {check, validationResult} = require('express-validator')

exports.validateAddFoodRequest = [
    check('price')
    .isNumeric()
    .withMessage('Price is required'),
]
