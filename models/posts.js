const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    _id: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Post', postSchema)