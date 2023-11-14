const express = require('express');
const { adminSignup, adminSignin, getCompany, imageUpload, imageGet, imageUploadCompany} = require('../../controller/Company/auth');
const { validateAdminSignupRequest, isRequestValidated, validateSigninRequest } = require('../../validators/auth');
const multer = require('multer')
const path = require('path')
const fs = require('fs');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'public/Images/';
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


router.post('/register-company', validateAdminSignupRequest, isRequestValidated, adminSignup);

router.post('/signin-company', validateSigninRequest, isRequestValidated, adminSignin);

router.get('/get-company/:id', getCompany)

router.post('/upload-image-company/:id', upload.single('file'), imageUploadCompany);
router.get('/get-image-company/:id', imageGet);

module.exports = router