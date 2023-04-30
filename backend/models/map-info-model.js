const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mapInfoSchema = new Schema({
    dataFromMap: {
        type: {}, required: true
    },
})

module.exports = mongoose.model('MapInfo', mapInfoSchema)