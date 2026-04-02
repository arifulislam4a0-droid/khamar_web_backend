const express = require("express");
const controller = require("../controllers/productController");
const adminAuth = require("../middlewares/adminAuth");
const upload = require("../config/multer");
const uploadCleanup = require("../middlewares/uploadCleanup");

const router = express.Router();

router.get("/admin-home", adminAuth, controller.getAdminHome);
router.get("/:id/share-link", adminAuth, controller.shareLink);
router.get("/:id", adminAuth, controller.getOne);
router.post("/", adminAuth, upload.array("images", 20), uploadCleanup, controller.create);
router.put("/:id", adminAuth, upload.array("images", 20), uploadCleanup, controller.update);
router.delete("/:id", adminAuth, controller.remove);

module.exports = router;
