const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");

const routes = require("./routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const { apiLimiter } = require("./middlewares/rateLimiters");
const env = require("./config/env");

const app = express();

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(compression());
app.use(hpp());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

if (env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}


app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
    maxAge: "7d",
    etag: true,
    lastModified: true
}));   

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "খামার কেন্দুয়া এগ্রো API চালু আছে"
    });
});

app.use("/api", apiLimiter, routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
