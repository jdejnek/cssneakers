const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    streetAddress: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: false,
    }
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);