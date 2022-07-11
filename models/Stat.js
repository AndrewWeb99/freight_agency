const { Schema, model } = require('mongoose')

const schema = new Schema({
    clients: {
        type: Number
    },
    country: {
        type: Number
    },
    active_employers: {
        type: Number
    },
    finished: {
        type: Number
    }

})

module.exports = model('Stat', schema)