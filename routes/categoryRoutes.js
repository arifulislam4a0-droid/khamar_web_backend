const express = require("express");
const controller = require("../controllers/categoryController");
const adminAuth = require("../middlewares/adminAuth");
const { validateCategory } = require("../middlewares/validate");

const router = express.Router();

router.get("/", adminAuth, controller.getAll);
router.post("/", adminAuth, validateCategory, controller.create);
router.put("/:id", adminAuth, validateCategory, controller.update);
router.delete("/:id", adminAuth, controller.remove);
router.put("/reorder/all", adminAuth, controller.reorder);

module.exports = router;
