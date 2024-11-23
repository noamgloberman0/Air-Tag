const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    message:{
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    post:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Comment', commentSchema)
