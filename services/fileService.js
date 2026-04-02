const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

exports.saveProductImages = async (files = []) => {
    const savedImages = [];

    for (const file of files) {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;

        const fileName = uniqueName;
        const dbUrl = `/uploads/products/${fileName}`;
        const absolutePath = path.join(__dirname, "..", "uploads", "products", fileName);

        await sharp(file.buffer)
            .rotate()
            .resize({ width: 1200, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(absolutePath);

        savedImages.push({
            url: dbUrl,
            fileName
        });
    }

    return savedImages;
};

exports.deleteSingleFile = async (fileUrl = "") => {
    try {
        if (!fileUrl) return;

        const cleanedPath = fileUrl.replace(/^\/+/, "");
        const filePath = path.join(__dirname, "..", cleanedPath);

        await fs.unlink(filePath);
    } catch (error) {
        // file না থাকলে ignore
    }
};

exports.deleteMultipleFiles = async (fileUrls = []) => {
    for (const fileUrl of fileUrls) {
        await exports.deleteSingleFile(fileUrl);
    }
};