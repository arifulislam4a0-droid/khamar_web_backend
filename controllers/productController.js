const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { cleanNullableText, cleanNumber, cleanBoolean } = require("../utils/sanitize");
const { createSlug } = require("../services/slugService");
const { saveProductImages, deleteMultipleFiles } = require("../services/fileService");
const env = require("../config/env");

const buildProductPayload = async (req, isUpdate = false, oldProduct = null) => {
    const name = cleanNullableText(req.body.name);
    const category = cleanNullableText(req.body.category);
    const description = cleanNullableText(req.body.description);
    const details = cleanNullableText(req.body.details);
    const price = cleanNumber(req.body.price);
    const offerPrice = cleanNumber(req.body.offerPrice);
    const trending = cleanBoolean(req.body.trending);

    let categoryId = null;

    if (category) {
        const categoryDoc = await Category.findById(category);
        if (!categoryDoc) {
            throw new ApiError("সঠিক ক্যাটাগরি পাওয়া যায়নি", 400);
        }
        categoryId = categoryDoc._id;
    }

    let slugBase = name || `product-${Date.now()}`;
    let slug = createSlug(slugBase) || `product-${Date.now()}`;
    const slugQuery = isUpdate && oldProduct ? { slug, _id: { $ne: oldProduct._id } } : { slug };
    const existingSlug = await Product.findOne(slugQuery);
    if (existingSlug) {
        slug = `${slug}-${Date.now()}`;
    }

    let newImages = [];
    if (req.files && req.files.length > 0) {
        newImages = await saveProductImages(req.files);
        newImages = newImages.map((img, index) => ({
            ...img,
            serial: index + 1
        }));
    }

    return {
        name,
        slug,
        category: categoryId,
        price,
        offerPrice,
        trending,
        description,
        details,
        newImages
    };
};

exports.create = asyncHandler(async (req, res) => {
    const payload = await buildProductPayload(req);

    const product = await Product.create({
        name: payload.name,
        slug: payload.slug,
        category: payload.category,
        price: payload.price,
        offerPrice: payload.offerPrice,
        trending: payload.trending,
        description: payload.description,
        details: payload.details,
        images: payload.newImages
    });

    return res.status(201).json({
        success: true,
        message: "প্রোডাক্ট সফলভাবে যোগ হয়েছে",
        data: product
    });
});

exports.getAdminHome = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ serial: 1, createdAt: 1 }).lean();
    const trendingProducts = await Product.find({ trending: true })
        .populate("category", "name slug serial")
        .sort({ createdAt: 1 })
        .lean();

    const products = await Product.find()
        .populate("category", "name slug serial")
        .sort({ createdAt: 1 })
        .lean();

    const groupedProducts = categories.map((category) => ({
        category,
        products: products.filter((product) => String(product.category?._id || "") === String(category._id))
    }));

    const uncategorized = products.filter((product) => !product.category);

    return res.status(200).json({
        success: true,
        data: {
            categories,
            trendingProducts,
            groupedProducts,
            uncategorized
        }
    });
});

exports.getOne = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id)
        .populate("category", "name slug serial")
        .lean();

    if (!product) {
        throw new ApiError("প্রোডাক্ট পাওয়া যায়নি", 404);
    }

    return res.status(200).json({
        success: true,
        data: product
    });
});

exports.update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError("প্রোডাক্ট পাওয়া যায়নি", 404);
    }

    const removeImageIds = Array.isArray(req.body.removeImageIds)
        ? req.body.removeImageIds
        : req.body.removeImageIds
            ? [req.body.removeImageIds]
            : [];

    const removableImages = product.images.filter((img) => removeImageIds.includes(String(img._id)));
    const removableUrls = removableImages.map((img) => img.url);

    product.images = product.images.filter((img) => !removeImageIds.includes(String(img._id)));
    await deleteMultipleFiles(removableUrls);

    const payload = await buildProductPayload(req, true, product);

    product.name = payload.name;
    product.slug = payload.slug;
    product.category = payload.category;
    product.price = payload.price;
    product.offerPrice = payload.offerPrice;
    product.trending = payload.trending;
    product.description = payload.description;
    product.details = payload.details;

    if (payload.newImages.length > 0) {
        const currentMax = product.images.length;
        const merged = payload.newImages.map((img, index) => ({
            ...img,
            serial: currentMax + index + 1
        }));
        product.images.push(...merged);
    }

    product.images = product.images.map((img, index) => ({
        ...(img.toObject ? img.toObject() : img),
        serial: index + 1
    }));

    await product.save();

    return res.status(200).json({
        success: true,
        message: "প্রোডাক্ট আপডেট হয়েছে",
        data: product
    });
});

exports.remove = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError("প্রোডাক্ট পাওয়া যায়নি", 404);
    }

    await deleteMultipleFiles(product.images.map((img) => img.url));
    await Order.deleteMany({ product: product._id });
    await Product.findByIdAndDelete(id);

    return res.status(200).json({
        success: true,
        message: "প্রোডাক্ট এবং সংশ্লিষ্ট ডাটা ডিলিট হয়েছে"
    });
});

exports.shareLink = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id).lean();
    if (!product) {
        throw new ApiError("প্রোডাক্ট পাওয়া যায়নি", 404);
    }

    const shareUrl = `${env.CLIENT_BASE_URL}/product-details/index.html?slug=${encodeURIComponent(product.slug)}`;

    return res.status(200).json({
        success: true,
        data: {
            shareUrl
        }
    });
});
