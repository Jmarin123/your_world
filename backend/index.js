if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors')
app.use(express.urlencoded({ extended: true }))
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};

app.use(cors(corsOptions));

app.use(cors(corsOptions));
const dbUrl = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017';

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});



const bodyParser = require('body-parser');
app.use(bodyParser.json());



app.use(express.static(path.join(__dirname, 'what')));

const authRouter = require('./routes/auth-router')
app.use('/auth', authRouter)

if (process.env.NODE_ENV !== "testing") {
    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, 'what', 'index.html')).status(200);
    });
}


module.exports = { app };