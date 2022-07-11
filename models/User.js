const { Schema, model } = require('mongoose')

const schema = new Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    second_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    phone_number: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        required: false,
        default: false
    }
})

module.exports = model('User', schema)