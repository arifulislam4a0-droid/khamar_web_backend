const ApiError = require("../utils/ApiError");
const { cleanText } = require("../utils/sanitize");

exports.validateAdminLogin = (req, res, next) => {
    const username = cleanText(req.body.username);
    const password = cleanText(req.body.password);

    if (!username || !password) {
        return next(new ApiError("ইউজারনেম এবং পাসওয়ার্ড দিন", 400));
    }

    req.body.username = username;
    req.body.password = password;
    next();
};

exports.validateCategory = (req, res, next) => {
    const name = cleanText(req.body.name);

    if (!name) {
        return next(new ApiError("ক্যাটাগরির নাম দিন", 400));
    }

    req.body.name = name;
    next();
};

exports.validateOrder = (req, res, next) => {
    const customerName = cleanText(req.body.customerName);
    const phone = cleanText(req.body.phone);
    const address = cleanText(req.body.address);
    const quantity = Number(req.body.quantity);

    if (!customerName) return next(new ApiError("আপনার নাম দিন", 400));
    if (!phone) return next(new ApiError("মোবাইল নম্বর দিন", 400));
    if (!address) return next(new ApiError("ঠিকানা দিন", 400));
    if (!Number.isInteger(quantity) || quantity < 1) {
        return next(new ApiError("সঠিক পিস সংখ্যা দিন", 400));
    }

    req.body.customerName = customerName;
    req.body.phone = phone;
    req.body.address = address;
    req.body.quantity = quantity;
    next();
};
