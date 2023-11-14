const express = require('express');
const { signup, signin, imageUpload, imageGet } = require('../controller/auth');
const {validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth')
const multer = require('multer')
const path = require('path')
const fs = require('fs');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'public/Images';
        // Create the directory if it doesn't exist
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})        
const upload = multer({
    storage: storage
})
const router = express.Router()

router.post('/register-user', validateSignupRequest, isRequestValidated, signup); 

router.post('/signin-user', validateSigninRequest, isRequestValidated, signin);

router.post('/upload-image/:id', upload.single('file'), imageUpload);
router.get('/get-image/:id', imageGet);


module.exports = router