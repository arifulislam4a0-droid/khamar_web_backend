const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { jwtCreate } = require("../utils/jwt");
const env = require("../config/env");

exports.login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (
        username !== env.ADMIN_USERNAME ||
        password !== env.ADMIN_PASSWORD
    ) {
        throw new ApiError("ভুল ইউজারনেম বা পাসওয়ার্ড", 401);
    }

    const token = jwtCreate({
        username: env.ADMIN_USERNAME,
        role: "admin"
    });

    return res.status(200).json({
        success: true,
        message: "লগইন সফল হয়েছে",
        token,
        admin: {
            username: env.ADMIN_USERNAME
        }
    });
});

exports.profile = asyncHandler(async (req, res) => {
    return res.status(200).json({
        success: true,
        admin: req.admin
    });
});