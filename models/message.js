const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    creted_at: {
        type: Date,
        required: true,
    default:Date.now()
    },
    
    whoSend: {
        type: String,
        required: true,
    },
    toSend: {
        type: String,
        required: true,
    },





},

)
module.exports = mongoose.model('message', userSchema)