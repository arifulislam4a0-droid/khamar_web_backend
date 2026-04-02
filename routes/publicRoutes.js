const express = require("express");
const controller = require("../controllers/publicController");

const router = express.Router();

router.get("/home", controller.home);
router.get("/products/:slug", controller.productDetailsBySlug);

module.exports = router;
