const express = require('express');
const { check, body } = require('express-validator/check');
const router = express.Router();
const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);
router.post(
    '/signup',
    [
        check('email').isEmail().withMessage('Please enter a valid email')
        .custom((value, {req}) => {
            return User.findOne({email: value}).then(userDoc => {
                if(userDoc){
                  return Promise.reject('User email already exists')
                }
            })
        }).normalizeEmail(),
        body('password', 'Please enter a password with only numbers/text and at least 5 characters')
        .isLength({min: 5}).isAlphanumeric().trim(),
        body('confirmPassword').custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error('Passwords must match!')
            }
            return true;
        }).trim()
    ],
    authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;