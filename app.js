const express = require('express');
const path = require('path');
const dbconfig = require('./config/dbconfig');

const bodyParser = require('body-parser')
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const exphbs = require('express-handlebars');

const flash = require('connect-flash');

const cookieParser = require('cookie-parser');
const session = require('express-session');


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;



const app = express();

const userRouter = require('./routes/user');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.set('PORT', process.env.port || 8000);

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());


// Passport init
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next)=>{
res.locals.register_error = req.flash('register_error');
res.locals.register_success = req.flash('register_success');
res.locals.error = req.flash('error');

next();
});

//check connection to database
mongoose.connect(dbconfig.connectionString, dbconfig.options);
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'database connection error:'));

db.once('open', function () {
    console.log('Connected to database');
});

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/create', (req, res) => {
    res.render('create');
});

//setup router 

app.use('/user', userRouter);

app.listen(app.get('PORT'), () => {
    console.log("app is listening on port " + (process.env.port || 8000));
});

