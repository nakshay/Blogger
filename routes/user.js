
const express = require('express');

const { check, body, validationResult } = require('express-validator/check');

const BlogModel = require('../models/blogModel');

const router = express.Router();

const UserModel = require('../models/userModel');

const auth = require('../auth');


//authenitcation 

const LocalStrategy = require('passport-local').Strategy;



router.post('/new', (req, res) => {
    let blog = new BlogModel();

    blog.title = req.body.title;
    blog.content = req.body.content;
    blog.author = res.locals.user.username;

    blog.save((error) => {
        if (error) {
            res.send("Error while creating blog",error);
            return;
        } else {
            res.redirect('/user/blogs');
        }

    });
});

router.get('/edit/:id', (req, res) => {

    BlogModel.findById(req.params.id, (error, data) => {
        if (error) {
            res.status(401).send("Error while editing  blog", error);
            return;
        }
        else {
            res.render('edit', { data });
        }
    });

});


router.delete('/deleteblog/:id',(req, res) => {
    var id =  req.params.id;
    var query = {_id: id};

    BlogModel.remove(query, (err) => {
        if (err){
            console.log(err);
            return;
        }
        else{
            res.end();
        }
    });

});

router.post('/update/:id', (req, res) => {

    let title = req.body.title;
    let content = req.body.content;

    let blog = {};

    blog.title = req.body.title;
    blog.content = req.body.content;
    blog.author = res.locals.user.username;




    BlogModel.update({_id:req.params.id}, blog, (err) => {
        
        if (err) {
            res.status(401).send("Error while updating blog", err);
            return;
        }
        else {
            res.redirect('/user/show/'+req.params.id);
        }
    }
    );
});


router.get('/blogs', auth.ensureAuthenticated, (req, res) => {
    let blogs = BlogModel.find({}, (err, data) => {
        if (err) {
            res.status(401).send("Error while showing  blog", error);
            return;
        }
        else {
            res.render('blogs', { blog: data.map(x => [x.title, x._id]) });
        }
    });
});

router.get('/show/:id', (req, res) => {
    BlogModel.findById(req.params.id, (error, data) => {
        if (error) {
            res.status(401).send("Error while creating blog", error);
            return;
        }
        else {
            res.render('show', { data });
        }
    });

});

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
    auth.authenticate('local', { successRedirect: '/user/blogs', failureRedirect: '/login', failureFlash: true }),
    (req, res) => {
        res.redirect('/user/blogs');
    });

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', "you have sucessfully logged out");
    res.redirect('/login');
});




module.exports = router;
