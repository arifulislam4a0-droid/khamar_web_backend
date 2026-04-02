const path = require("path");
const fs = require("fs");
const multer = require("multer");
const env = require("./env");
const ApiError = require("../utils/ApiError");

const uploadDir = path.join(__dirname, "..", "uploads", "products");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new ApiError("শুধু JPG, PNG, WEBP ছবি আপলোড করা যাবে", 400), false);
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024,
        files: 20
    }
});

module.exports = upload;
