const express = require('express');
const path = require('path');
const dbconfig = require('./config/dbconfig');

const bodyParser = require('body-parser')
const mongoose = require('mongoose');

var exphbs  = require('express-handlebars');

const app = express();

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

app.use('/',(req, res) => {
    res.render('home',{blogger:'Blogger'});
});

app.listen(app.get('PORT'), () => {
    console.log("app is listening on port "+(process.env.port||8000));
});