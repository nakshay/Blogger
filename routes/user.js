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
            res.redirect('/blogs');
        }

    });
});

module.exports = router;