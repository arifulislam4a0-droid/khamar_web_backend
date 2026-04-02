exports.createSlug = (value = "") => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9ঀ-৿\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};
