const jwt = require("jsonwebtoken");
const env = require("../config/env");

exports.jwtCreate = (payload) => {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN
    });
};

exports.jwtVerify = (token) => {
    return jwt.verify(token, env.JWT_SECRET);
};
