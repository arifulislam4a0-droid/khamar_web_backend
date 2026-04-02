const rateLimit = require("express-rate-limit");

exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "অল্প সময়ের মধ্যে অনেক বেশি রিকোয়েস্ট করা হয়েছে"
    }
});

exports.loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "অনেকবার লগইন চেষ্টা করা হয়েছে, কিছুক্ষণ পর আবার চেষ্টা করুন"
    }
});

exports.orderLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "অনেক বেশি অর্ডার রিকোয়েস্ট এসেছে, একটু পরে আবার চেষ্টা করুন"
    }
});
