const Category = require("../models/Category");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const env = require("../config/env");

exports.home = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ serial: 1, createdAt: 1 }).lean();
    const allProducts = await Product.find()
        .populate("category", "name slug serial")
        .sort({ createdAt: 1 })
        .lean();

    const trendingProducts = allProducts.filter((item) => item.trending);

    const groupedProducts = categories.map((category) => ({
        category,
        products: allProducts.filter((product) => String(product.category?._id || "") === String(category._id))
    }));

    const uncategorized = allProducts.filter((product) => !product.category);

    return res.status(200).json({
        success: true,
        data: {
            site: {
                name: "খামার কেন্দুয়া এগ্রো",
                phone: "০১৬০৯৩৪৭৭৪৬"
            },
            categories,
            trendingProducts,
            groupedProducts,
            uncategorized
        }
    });
});

exports.productDetailsBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const product = await Product.findOne({ slug })
        .populate("category", "name slug serial")
        .lean();

    if (!product) {
        throw new ApiError("প্রোডাক্ট পাওয়া যায়নি", 404);
    }

    const shareUrl = `${env.CLIENT_BASE_URL}/product-details/index.html?slug=${encodeURIComponent(product.slug)}`;

    return res.status(200).json({
        success: true,
        data: {
            ...product,
            shareUrl
        }
    });
});
