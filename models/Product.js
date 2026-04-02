const mongoose = require("mongoose");
const productImageSchema = require("./ProductImage");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: ""
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null,
        index: true
    },
    price: {
        type: Number,
        default: null
    },
    offerPrice: {
        type: Number,
        default: null
    },
    trending: {
        type: Boolean,
        default: false,
        index: true
    },
    description: {
        type: String,
        default: ""
    },
    details: {
        type: String,
        default: ""
    },
    images: {
        type: [productImageSchema],
        default: []
    }
}, {
    timestamps: true,
    versionKey: false
});

productSchema.index({ createdAt: 1 });

module.exports = mongoose.model("Product", productSchema);
