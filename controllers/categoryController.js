const Category = require("../models/Category");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { createSlug } = require("../services/slugService");

exports.create = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const exists = await Category.findOne({ name });
    if (exists) {
        throw new ApiError("এই ক্যাটাগরি আগে থেকেই আছে", 400);
    }

    const count = await Category.countDocuments();
    let slug = createSlug(name);

    if (!slug) slug = `category-${Date.now()}`;

    const existingSlug = await Category.findOne({ slug });
    if (existingSlug) {
        slug = `${slug}-${Date.now()}`;
    }

    const category = await Category.create({
        name,
        slug,
        serial: count + 1
    });

    return res.status(201).json({
        success: true,
        message: "ক্যাটাগরি সফলভাবে যোগ হয়েছে",
        data: category
    });
});

exports.getAll = asyncHandler(async (req, res) => {
    const categories = await Category.find()
        .sort({ serial: 1, createdAt: 1 })
        .lean();

    return res.status(200).json({
        success: true,
        data: categories
    });
});

exports.update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findById(id);
    if (!category) {
        throw new ApiError("ক্যাটাগরি পাওয়া যায়নি", 404);
    }

    const duplicate = await Category.findOne({ name, _id: { $ne: id } });
    if (duplicate) {
        throw new ApiError("এই নামের আরেকটি ক্যাটাগরি আছে", 400);
    }

    category.name = name;
    let slug = createSlug(name) || `category-${Date.now()}`;

    const slugExists = await Category.findOne({ slug, _id: { $ne: id } });
    if (slugExists) slug = `${slug}-${Date.now()}`;

    category.slug = slug;
    await category.save();

    return res.status(200).json({
        success: true,
        message: "ক্যাটাগরি আপডেট হয়েছে",
        data: category
    });
});

exports.remove = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
        throw new ApiError("ক্যাটাগরি পাওয়া যায়নি", 404);
    }

    const relatedProductExists = await Product.findOne({ category: id }).lean();
    if (relatedProductExists) {
        throw new ApiError("এই ক্যাটাগরির মধ্যে প্রোডাক্ট আছে, আগে প্রোডাক্ট সরান", 400);
    }

    await Category.findByIdAndDelete(id);

    const categories = await Category.find().sort({ serial: 1, createdAt: 1 });
    for (let i = 0; i < categories.length; i += 1) {
        categories[i].serial = i + 1;
        await categories[i].save();
    }

    return res.status(200).json({
        success: true,
        message: "ক্যাটাগরি ডিলিট হয়েছে"
    });
});

exports.reorder = asyncHandler(async (req, res) => {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        throw new ApiError("রিঅর্ডার ডাটা সঠিক নয়", 400);
    }

    for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        await Category.findByIdAndUpdate(item.id, { serial: i + 1 });
    }

    const categories = await Category.find().sort({ serial: 1, createdAt: 1 }).lean();

    return res.status(200).json({
        success: true,
        message: "ক্যাটাগরি সিরিয়াল আপডেট হয়েছে",
        data: categories
    });
});
