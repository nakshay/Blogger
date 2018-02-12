const express = require('express');
const path = require('path');
const dbconfig = require('./config/dbconfig');

const bodyParser = require('body-parser')
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var exphbs  = require('express-handlebars');

const app = express();

const userRouter = require('./routes/user');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.set('PORT',process.env.port || 8000);

app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json())


//check connection to database
mongoose.connect(dbconfig.connectionString,dbconfig.options);
let db=mongoose.connection;

db.on('error', console.error.bind(console, 'database connection error:'));

db.once('open', function() {
    console.log('Connected to database');
});

app.get('/',(req, res) => {
    res.render('home');
});
app.get('/login',(req, res) => {
    res.render('login');
});
app.get('/register',(req, res) => {
    res.render('register');
});

app.get('/create',(req, res) => {
    res.render('create');
});

app.get('/blogs',(req, res) => {
    res.render('blogs');
});

//setup router 

app.use('/user',userRouter);


app.listen(app.get('PORT'), () => {
    console.log("app is listening on port "+(process.env.port||8000));
});

