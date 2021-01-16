const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { updata, user } = require('../models/userModel');
const passport = require('../passport');

router.get('/signin', userController.signin);

router.post('/signin',  passport.authenticate('local', {successRedirect: '/',
failureRedirect: '/users/signin?error=wrong-password',
failureFlash: false,
}));

router.get('/signup', userController.signup);

router.post('/signup', userController.add);

router.get('/updateInfor', userController.updateInfor);

router.post('/updateInfor', userController.postInfor);

router.get('/moreMoney', userController.moreMoney);

router.post('/moreMoney', userController.postBlance);

router.get('/infor', userController.infor);

router.get('/history', userController.history);

router.get('/history/:id', userController.history_detail);

router.get('/logout', function(req,res) {
    req.logout();
    res.redirect('/users/signin')
})

router.get('/post', userController.post);

router.get('/rePassword', userController.rePassword);

router.post('/rePassword', userController.postPassword);


module.exports = router;
