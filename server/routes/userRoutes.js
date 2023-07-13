const express=require('express');

const {loginUser,signupUser,forgotpassword,resetpassword } =require('../controllers/userController.js');

const router=express.Router();
//login route
router.post('/login',loginUser);

//register route
router.post('/signup',signupUser);

// forgot password
router.post('/forgotpassword',forgotpassword);

//reset password
router.put('/resetpassword/:newToken',resetpassword);

module.exports=router;