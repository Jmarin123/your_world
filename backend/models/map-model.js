const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mapSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        owner: { type: String, required: true },
        dataFromMap:
            { type: Schema.Types.ObjectId, ref: 'MapInfo' },
        comments: { type: [[String]], required: true },
        likes: { type: [String], required: true },
        dislikes: { type: [String], required: true },
        publish: { type: { isPublished: Boolean, pushlishedDate: Date }, required: true },
        image: { type: String, required: true },
        uniqueProperties: { type: [String] },
        markers: [
            {
                lat: { type: Number, required: true },
                lng: { type: Number, required: true },
                value: { type: String, required: true },
                font: { type: String, required: true },
            },
        ],
    },
    { timestamps: true },
)

module.exports = mongoose.model('Map', mapSchema)
