const express = require("express");
const controller = require("../controllers/orderController");
const adminAuth = require("../middlewares/adminAuth");
const { validateOrder } = require("../middlewares/validate");
const { orderLimiter } = require("../middlewares/rateLimiters");

const router = express.Router();

router.post("/", orderLimiter, validateOrder, controller.create);
router.get("/", adminAuth, controller.getByStatus);
router.put("/:id/status", adminAuth, controller.updateStatus);

module.exports = router;
