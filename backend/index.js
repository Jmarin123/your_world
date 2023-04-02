// if (process.env.NODE_ENV !== "production") {
require('dotenv').config();
// }
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const request = require('supertest');

const cors = require('cors')
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: ["http://localhost:3001"],
    credentials: true
}))

const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017/your_world"
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});


const bodyParser = require('body-parser');
app.use(bodyParser.json());



app.use(express.static(path.join(__dirname, 'build')));

const authRouter = require('./routes/auth-router')
app.use('/auth', authRouter)

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})

if (process.env.NODE_ENV === "CI") {
    describe('Bad Post to /auth/login', function () {
        it('responds with json', function (done) {
            request(app)
                .post('/auth/login')
                .send("firstname=joe")
                .expect(500)
                .end(function (err, res) {
                    if (err) return done(err);
                    return done();
                });
        })
    })
}