const express = require('express');

const blogModel = require('../models/blogSchema');

const router = express.Router();


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


module.exports = router;
