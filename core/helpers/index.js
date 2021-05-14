//debounce
export function debounce(handler, ms, immediate = false) {
    let timeout;
    return function H() {
        let __this = this, args = arguments, callNow = immediate && !timeout;
        function later() {
            timeout = null;
            if(!immediate) handler.apply(__this, args);
        }
        clearTimeout(timeout);
        timeout = setTimeout(later, ms);
        if(callNow) handler.apply(__this, args);
    };
}

export function isObject(data) {
    return !Array.isArray(data) && data !== null && typeof data === "object";
}

// camelize
export function camelize(str) {
    if(typeof str !== "string") throw new Error("toCamelCase error: argument str must be typeof string");
    return str.replace(/^([A-Z])|[\s-_]+(\w)/g, function(match, p1, p2) {
        if(p2) return p2.toUpperCase();
        return p1.toLowerCase();
    });
}

//decamelize
export function decamelize(str, separator = "_") {
    if(typeof str !== "string") throw new Error("decamelize error: argument str must be typeof string");
    return str
        .replace(/([a-z\d])([A-Z])/g, `$1${separator}$2`)
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, `$1${separator}$2`)
        .toLowerCase();
}

export function camelizeObject(obj, revert = false) {
    const camelizeHandler = revert ? decamelize : camelize;
    return Object.fromEntries(Object.entries(obj).map((item) => {
        const prop = camelizeHandler(item[0]),
            camelizeArray = (arr) => arr.map(item => {
                if(isObject(item)) return camelizeObject(item, revert);
                if(Array.isArray(item)) return camelizeArray(item);
                return item;
            });
        let value = item[1];
        if(isObject(value)) value = camelizeObject(value, revert);
        if(Array.isArray(value)) value = camelizeArray(value);
        return [ prop, value ];
    }));
}

export function isObjectEmpty(obj) {
    if(!isObject(obj)) throw new Error("try to check non object");
    return Object.keys(obj).length === 0;
}

export function arrayChunk(arr, size) {
    const temp = [];
    for(let i = 0; i < arr.length; i += size) temp.push(arr.slice(i, i + size));
    return temp;
}

export function deepSearch(name, obj, errorOnEmpty = false) {
    if(!isObject(obj) && !Array.isArray(obj)) {
        return errorOnEmpty ? "No searchable object" : undefined;
    }
    let path = name.split("."),
        levelName = path[0],
        level = obj[levelName];
    path.splice(0, 1);
    if(!path.length) return level;
    else if(isObject(level) || Array.isArray(level)) return deepSearch(path.join("."), level);
    return errorOnEmpty ? deepSearch(path.join("."), level) : undefined;
}

export function pathCatSlashes(path) {
    if(path[0] === "/") path = path.substr(1, path.length);
    if(path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
    return path;
}

export function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}