const { Schema, model } = require('mongoose')
const moment = require('moment')

const schema = new Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true,
        default: moment().format("DD-MM-YYYY hh:mm:ss")
    },
    height: {
        type: String,
        required: false,
        default: 0
    },
    width: {
        type: String,
        required: false,
        default: 0
    },
    len: {
        type: String,
        required: false,
        default: 0
    },
    weight: {
        type: String,
        required: false,
        default: 0
    },
    volume: {
        type: String,
        required: false,
        default: 0
    },
    transport_type: {
        type: String,
        required: true
    },
    total_weight: {
        type: String,
        required: false,
        default: 0
    },
    total_volume: {
        type: String,
        required: false,
        default: 0
    },
    max_size: {
        type: String,
        required: false,
        default: 0
    },
    cargo_price: {
        type: String,
        required: true
    },
    documents_transport: {
        type: Boolean,
        required: true
    },
    return_documents: {
        type: Boolean,
        required: true
    },
    plobmbir_cargo: {
        type: Boolean,
        required: true
    },
    plobmbir_cargo_count: {
        type: Number,
        required: true
    },
    thin_cargo: {
        type: Boolean,
        required: true
    },
    pack_cargo: {
        type: Boolean,
        required: true
    },
    transport_sum_value: {
        type: Number,
        required: true
    },
    days_value: {
        type: Number,
        required: true
    },
    km_value: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true 
    },
    phone_number: {
        type: String,
        required: true 
    },
    user_name: {
        type: String,
        required: true 
    },
    track_id: {
        type: String,
        required: true
    },
    track_status: {
        type: Number,
        required: true,
        default: 0
    },
    track_status_text: {
        type: String,
        required: true,
        default: 'В обработке'
    }
})

module.exports = model('Cargo', schema)