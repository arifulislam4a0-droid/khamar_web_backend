const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.create = asyncHandler(async (req, res) => {
    const { productId, customerName, phone, address, quantity } = req.body;

    const product = await Product.findById(productId).lean();
    if (!product) {
        throw new ApiError("প্রোডাক্ট পাওয়া যায়নি", 404);
    }

    await Order.create({
        product: productId,
        customerName,
        phone,
        address,
        quantity,
        status: "incoming"
    });

    return res.status(201).json({
        success: true,
        message: "আপনার অর্ডার কনফার্ম হয়েছে। দয়া করে অপেক্ষা করুন, আমাদের প্রতিনিধি দ্রুত যোগাযোগ করবেন।"
    });
});

exports.getByStatus = asyncHandler(async (req, res) => {
    const allowed = ["incoming", "confirmed", "delivery", "cancelled"];
    const status = allowed.includes(req.query.status) ? req.query.status : "incoming";

    const orders = await Order.find({ status })
        .populate({
            path: "product",
            populate: { path: "category", select: "name slug serial" }
        })
        .sort({ createdAt: 1 })
        .lean();

    return res.status(200).json({
        success: true,
        data: orders
    });
});

exports.updateStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ["incoming", "confirmed", "delivery", "cancelled"];

    if (!allowed.includes(status)) {
        throw new ApiError("সঠিক স্ট্যাটাস দিন", 400);
    }

    const order = await Order.findById(id);
    if (!order) {
        throw new ApiError("অর্ডার পাওয়া যায়নি", 404);
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
        success: true,
        message: "অর্ডারের স্ট্যাটাস আপডেট হয়েছে",
        data: order
    });
});
