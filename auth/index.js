const UserModel = require('../models/userModel');


//authenitcation 

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


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

passport.ensureAuthenticated = (req ,res ,next) => {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error","you are not logged in");
        res.redirect('/login');
    }
};



module.exports = passport;