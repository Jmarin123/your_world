if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors')
const cookieParser = require('cookie-parser')
app.use(express.urlencoded({ extended: true }))
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};


app.use(cors(corsOptions));

const dbUrl = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017';

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

// const bodyParser = require('body-parser');

var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.use(cookieParser())
// app.use(bodyParser.json());



app.use(express.static(path.join(__dirname, 'what')));

const authRouter = require('./routes/auth-router')
app.use('/auth', authRouter)

const mapsRouter = require('./routes/maps-router')
app.use('/api', mapsRouter)

if (process.env.NODE_ENV !== "testing") {
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'what', 'index.html'));
    });
}



module.exports = { app };