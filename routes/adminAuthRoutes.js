const express = require("express");
const controller = require("../controllers/adminAuthController");
const { validateAdminLogin } = require("../middlewares/validate");
const adminAuth = require("../middlewares/adminAuth");
const { loginLimiter } = require("../middlewares/rateLimiters");

const router = express.Router();

router.post("/login", loginLimiter, validateAdminLogin, controller.login);
router.get("/profile", adminAuth, controller.profile);

module.exports = router;
