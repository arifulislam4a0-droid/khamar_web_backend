exports.cleanText = (value = "") => {
    if (typeof value !== "string") return "";
    return value.replace(/\s+/g, " ").trim();
};

exports.cleanNullableText = (value = "") => {
    const cleaned = exports.cleanText(value);
    return cleaned || "";
};

exports.cleanNumber = (value) => {
    if (value === undefined || value === null || value === "") return null;
    const num = Number(value);
    return Number.isNaN(num) ? null : num;
};

exports.cleanBoolean = (value) => {
    if (value === true || value === false) return value;
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === 1 || value === "1") return true;
    if (value === 0 || value === "0") return false;
    return false;
};
