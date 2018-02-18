
const express = require('express');
const router = express.Router();

const BlogModel = require('../models/blogModel');
const auth = require('../auth');

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
            res.redirect('/blog/all');
        }

    });
});


router.get('/all', auth.ensureAuthenticated, (req, res) => {
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
            res.redirect('/blog/show/'+req.params.id);
        }
    }
    );
});



router.get('/show/:id', (req, res) => {
    BlogModel.findById(req.params.id, (error, data) => {
        if (error) {
            res.status(401).send("Error while creating blog", error);
            return;
        }
        else {
            
            let allowed = res.locals.user.username == data.author;
            res.render('show', { data,allowed});
        }
    });

});



module.exports = router;