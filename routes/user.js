const express = require('express');

const blogModel = require('../models/blogModel');

const router = express.Router();

const UserModel = require('../models/userModel');

//authenitcation 

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;




router.post('/new', (req, res) => {
    let blog = new blogModel();

    blog.title = req.body.title;
    blog.content = req.body.content;
    blog.author = 'akshay.naik';

    blog.save((error) => {
        if (error) {
            res.status(401).send("Error while creating blog", error);
            return;
        } else {
            res.redirect('/user/blogs');
        }

    });
});

router.get('/blogs', (req, res) => {
    let blogs = blogModel.find({}, (err, data) => {
        if (err) {
            res.status(401).send("Error while creating blog", error);
            return;
        }
        else {
            res.render('blogs', { blog: data.map(x => [x.title, x._id]) });
        }
    });
});

router.get('/show/:id', (req, res) => {
    blogModel.findById(req.params.id, (error, data) => {
        if (error) {
            res.status(401).send("Error while creating blog", error);
            return;
        }
        else {
            res.render('show', { data });
        }
    });

});

router.post('/newUser', (req, res) => {

    let newUser = new UserModel();

    newUser.username = req.body.username;
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    UserModel.createUser(newUser, (error, user) => {
        if (error) {
            req.flash('register_error', error);
            res.redirect('/register')
        }
        else {
            req.flash('register_success', "Registration sucessful please login");
            res.redirect('/login');
        }
    });
});



router.post('/login',
    passport.authenticate('local', { successRedirect: '/user/blogs', failureRedirect: '/login', failureFlash: true }),
    function (req, res) {
        res.redirect('/user/blogs');
    });


passport.use(new LocalStrategy(
    function (username, password, done) {

        UserModel.findUserbyUsername(username, (err, user) => {

            if (err) {
                return done(err);
                console.log("failed username")
            }
            if (!user) {

                return done(null, false, { message: 'Incorrect username.' });

            }

            UserModel.comparePassword(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });

                }
            });
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});


passport.deserializeUser(function (id, done) {
    UserModel.getUserById(id, function (err, user) {
        done(err, user);
    });
});


module.exports = router;
