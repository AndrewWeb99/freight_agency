const { Schema, model } = require('mongoose')
const moment = require('moment')

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true,
        default: moment().format("DD-MM-YYYY hh:mm:ss")
    },
    img: {
        type: String,
        required: true
    }

})

module.exports = model('News', schema)