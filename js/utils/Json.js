export function jsonAddNonZero(json, key, value) {
    if (value !== 0) {
        json[key] = value;
    }
    return json;
}
