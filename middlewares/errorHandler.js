module.exports = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;

    if (process.env.NODE_ENV !== "production") {
        console.error(error);
    }

    return res.status(statusCode).json({
        success: false,
        message: error.message || "সার্ভার সমস্যা হয়েছে"
    });
};
