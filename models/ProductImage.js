const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    serial: {
        type: Number,
        default: 0
    }
}, {
    _id: true,
    versionKey: false
});

module.exports = productImageSchema;
