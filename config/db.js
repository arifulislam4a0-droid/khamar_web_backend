const mongoose = require("mongoose");
const env = require("./env");

const connectDB = async () => {
    mongoose.set("strictQuery", true);

    await mongoose.connect(env.MONGODB_URI, {
        autoIndex: env.NODE_ENV !== "production"
    });

    console.log("MongoDB connected");
};
 
module.exports = connectDB;
