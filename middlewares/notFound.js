module.exports = (req, res) => {
    return res.status(404).json({
        success: false,
        message: "রিসোর্স পাওয়া যায়নি"
    });
};
