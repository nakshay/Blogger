
const express = require('express');
const router = express.Router();

const BlogModel = require('../models/blogModel');
const auth = require('../auth');

router.post('/new', (req, res) => {

    if (res.locals.user === null) {
        res.redirect('/login');
        return;
    }

    let blog = new BlogModel();

    blog.title = req.body.title;
    blog.content = req.body.content;
    blog.author = res.locals.user.username;

    blog.save((error) => {
        if (error) {
            res.send("Error while creating blog", error);
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


router.delete('/deleteblog/:id', (req, res) => {
    var id = req.params.id;
    var query = { _id: id };

    BlogModel.remove(query, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        else {
            res.end();
        }
    });

});

router.post('/update/:id', (req, res) => {

    if (res.locals.user === null) {
        res.redirect('/login');
        return;
    }

    let title = req.body.title;
    let content = req.body.content;

    let blog = {};

    blog.title = req.body.title;
    blog.content = req.body.content;
    blog.author = res.locals.user.username;




    BlogModel.update({ _id: req.params.id }, blog, (err) => {

        if (err) {
            res.status(401).send("Error while updating blog", err);
            return;
        }
        else {
            res.redirect('/blog/show/' + req.params.id);
        }
    }
    );
});



router.get('/show/:id', (req, res) => {

    if (res.locals.user === null) {
        res.redirect('/login');
        return;
    }

    BlogModel.findById(req.params.id, (error, data) => {
        if (error) {
            res.status(401).send("Error while creating blog", error);
            return;
        }
        else {

            let allowed = res.locals.user.username == data.author;
            res.render('show', { data, allowed });
        }
    });
});

router.post('/comment/:id', (req, res) => {
    BlogModel.findById(req.params.id, (error, blog) => {
        if (error) {
            res.status(401).send("Error while searching blog", error);
            return;
        }
        else {
            var comment = { "comment": req.body.comment, "commentor": req.body.commentor };
            blog.comments.push(comment)
            blog.save(() => {
                res.end();
            });

        }
    });
});

router.post('/like/:id', (req, res) => {
    BlogModel.findById(req.params.id, (error, blog) => {
        if (error) {
            res.status(401).send("Error while searching blog", error);
            return;
        }
        else {

            blog.total_likes = blog.total_likes + 1;

            let user = blog.users.filter(user => user.username === req.body.commentor)[0];
            if (typeof (user) === 'undefined') {
                user = { username: req.body.commentor, like: 1, dislike: 0 }
                blog.users.push(user);
            }
            else {

                user = { username: req.body.commentor, like: 1, dislike: 0 }
                let index = blog.users.indexOf(blog.users.filter(user => user.username === req.body.commentor)[0]);
                blog.users.splice(index,1,user);
            }
     
            blog.save(() => {
                res.end();
            });

        }
    });
});

router.post('/dislike/:id', (req, res) => {
    BlogModel.findById(req.params.id, (error, blog) => {
        if (error) {
            res.status(401).send("Error while searching blog", error);
            return;
        }
        else {
            blog.total_dislikes = blog.total_dislikes + 1;

            let user = blog.users.filter(user => user.username === req.body.commentor)[0];
            if (typeof (user) === 'undefined') {
                user = { username: req.body.commentor, like: 0, dislike: 1 }
                blog.users.push(user);
            }
            else {

                user = { username: req.body.commentor, like: 0, dislike: 1 }
                let index = blog.users.indexOf(blog.users.filter(user => user.username === req.body.commentor)[0]);
                blog.users.splice(index,1,user);
            }
           
            blog.save(() => {
                res.end();
            });
        }
    });
});

module.exports = router;