if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

//const cors = require('cors')
app.use(express.urlencoded({ extended: true }))
// app.use(cors({
//     origin: ["http://localhost:3001"],
//     credentials: true
// }))

const dbUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/your_world';

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

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'what', 'index.html'));
});


module.exports = { app };