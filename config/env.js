const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
    MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://arifulislam4a0_db_user:g9uRJQ2C8p1uxdd7@cluster0.wfp6fcf.mongodb.net/?appName=Cluster0",
    JWT_SECRET: process.env.JWT_SECRET || "CHANGE_ME",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || "admin",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin",
    CLIENT_BASE_URL: process.env.CLIENT_BASE_URL || "http://127.0.0.1:5500",
    MAX_FILE_SIZE_MB: Number(process.env.MAX_FILE_SIZE_MB || 5)
};
     