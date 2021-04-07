const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true

    },
    prenom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    verified: {
        type: Boolean,
        default: false

    },
    image: {
        type: String
    },
    social: {
        type: Boolean,
        default: false
    },
    accepted: {
        type: Boolean,
        default: false

    }





},

)
module.exports = mongoose.model('user', userSchema)