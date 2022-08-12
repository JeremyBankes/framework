export default class Data {
    static has(source, path) {
        if (typeof path === 'string') {
            path = path.split('.');
        }
        if (path.length === 0) {
            return true;
        }
        const key = path.shift();
        if (typeof source === 'object' && source !== null && key in source) {
            return Data.has(source[key], path);
        }
        return false;
    }
    static get(source, path, fallback = null) {
        if (typeof path === 'string') {
            path = path.split('.');
        }
        if (path.length === 0) {
            return source;
        }
        const key = path.shift();
        if (typeof source === 'object' && source !== null && key in source) {
            return Data.get(source[key], path, fallback);
        }
        return fallback;
    }
    static set(source, path, value) {
        if (typeof path === 'string') {
            path = path.split('.');
        }
        const key = path.shift();
        if (path.length === 0) {
            source[key] = value;
            return;
        }
        if (typeof source[key] !== 'object') {
            source[key] = {};
        }
        Data.set(source[key], path, value);
    }
}
