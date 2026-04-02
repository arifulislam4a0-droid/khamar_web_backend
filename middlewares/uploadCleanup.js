module.exports = (req, res, next) => {
    // এই project-এ multer.memoryStorage() ব্যবহার করা হয়েছে।
    // তাই temporary disk file তৈরি হয় না, cleanup করারও দরকার হয় না।
    // ভবিষ্যতে diskStorage ব্যবহার করলে এখানে file unlink logic যোগ করা যাবে।
    next();
};
