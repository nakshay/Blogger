
const express = require('express');
const router = express.Router();

const { check, body, validationResult } = require('express-validator/check');

const BlogModel = require('../models/blogModel');

const UserModel = require('../models/userModel');

const auth = require('../auth');


//authenitcation 

const LocalStrategy = require('passport-local').Strategy;

router.post('/newUser', [
    //express validation starts here

    check('email').isEmail().withMessage('email address is invalid').trim().normalizeEmail(),
    check('password', 'password is must').exists(),
    check('password2').custom((value, { req }) => {

        if (value !== req.body.password) {
            throw new Error("verify password does not match");
        }
        else {
            return value;
        }
    })

], (req, res) => {


    const valError = validationResult(req);

    if (valError.array().length > 0) {
        req.flash('error_msg_array', valError.array());
        res.redirect('/register')
        return;
    }

    let newUser = new UserModel();

    newUser.username = req.body.username;
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    UserModel.createUser(newUser, (error, user) => {
        if (error) {
            req.flash('error_msg', error);
            res.redirect('/register')
        }
        else {
            req.flash('success_msg', "Registration sucessful please login");
            res.redirect('/login');
        }
    });
});

router.post('/login',
    auth.authenticate('local', { successRedirect: '/blog/all', failureRedirect: '/login', failureFlash: true }),
    (req, res) => {
        res.redirect('/blog/all');
    });

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', "you have sucessfully logged out");
    res.redirect('/login');
});


module.exports = router;
