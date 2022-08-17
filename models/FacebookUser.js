const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    facebookId: {
        type: String,
    },
    displayName: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String
    },
    gender: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('FacebookUser',UserSchema)