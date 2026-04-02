const express = require("express");
const adminAuthRoutes = require("./adminAuthRoutes");
const categoryRoutes = require("./categoryRoutes");
const productRoutes = require("./productRoutes");
const orderRoutes = require("./orderRoutes");
const publicRoutes = require("./publicRoutes");

const router = express.Router();

router.use("/admin-auth", adminAuthRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/public", publicRoutes);

module.exports = router;
