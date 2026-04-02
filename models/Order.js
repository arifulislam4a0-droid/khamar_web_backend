const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30
    },
    address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 100000
    },
    status: {
        type: String,
        enum: ["incoming", "confirmed", "delivery", "cancelled"],
        default: "incoming",
        index: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        index: true
    }
}, {
    timestamps: true,
    versionKey: false
});

orderSchema.index({ status: 1, createdAt: 1 });

module.exports = mongoose.model("Order", orderSchema);
