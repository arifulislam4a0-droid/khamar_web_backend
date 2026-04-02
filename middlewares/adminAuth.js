const { jwtVerify } = require("../utils/jwt");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "অ্যাক্সেস টোকেন পাওয়া যায়নি"
            });
        }

        const decoded = jwtVerify(token);

        if (decoded.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "আপনার অনুমতি নেই"
            });
        }

        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "অবৈধ বা মেয়াদোত্তীর্ণ টোকেন"
        });
    }
};