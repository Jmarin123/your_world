const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mapInfoSchema = new Schema({
    uniqueHash: String,
    expirationDate: Number,
    email: String
})

module.exports = mongoose.model('PasswordSent', mapInfoSchema)