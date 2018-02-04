const express = require('express');

const app = express();

app.set('PORT',process.env.port || 8000);

app.use('/',(req, res) => {
    res.send("Welcome to Blogger app");
});

app.listen(app.get('PORT'), () => {
    console.log("app is listening on port "+(process.env.port||8000));
});