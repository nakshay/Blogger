const express = require('express');

const blogModel = require('../models/blogModel');

const router = express.Router();

const UserModel = require('../models/userModel');


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

router.get('/blogs',(req, res) => {
    let blogs = blogModel.find({}, (err, data) => {
        if(err) {
            res.status(401).send("Error while creating blog", error);
            return;
        }
        else {
            res.render('blogs', {blog : data.map(x =>[x.title,x._id])});
        }
    });
});

router.get('/show/:id', (req, res)=>{
    blogModel.findById(req.params.id,(error, data) => {
        if(error) {
            res.status(401).send("Error while creating blog", error);
            return;
        }
        else{
            res.render('show',{data});
        }
    });

});

router.post('/newUser',(req, res)=>{

    let newUser = new UserModel();

    newUser.username = req.body.username;
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    UserModel.createUser(newUser, (error, user)=>{
        if(error){
            console.log(error);
            res.render('register')
        }
        else{
            res.redirect('/user/blogs');
        }
    });
});

module.exports = router;
