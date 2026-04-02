const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    serial: {
        type: Number,
        required: true,
        default: 0,
        index: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("Category", categorySchema);
