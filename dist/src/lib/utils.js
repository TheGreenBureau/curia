"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDateArraySortedByTime = exports.getNodeText = exports.dateString = exports.sortStrings = exports.sortDates = exports.jsonTypeParse = exports.findByKey = exports.isKey = exports.stringKeys = exports.keys = exports.getDataAsOptions = exports.getOption = exports.getDataAsArray = exports.optionsFromObject = exports.getLocalizedData = exports.cn = void 0;
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
const date_fns_1 = require("date-fns");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
exports.cn = cn;
const getLocalizedData = (fi, sv, lang) => {
    if (lang === "sv") {
        return sv;
    }
    return fi;
};
exports.getLocalizedData = getLocalizedData;
const filteredData = (data, filterKeys) => {
    return Object.fromEntries(filterKeys.map((k) => [k, data[k]]));
};
const optionsFromObject = (data) => {
    return Object.keys(data).map((key) => {
        return {
            value: key,
            label: data[key],
        };
    });
};
exports.optionsFromObject = optionsFromObject;
const getDataAsArray = (fi, sv, lang, options) => {
    const data = (0, exports.getLocalizedData)(fi, sv, lang);
    if (options?.filterKeys) {
        return Object.values(filteredData(data, options.filterKeys));
    }
    return Object.values(data);
};
exports.getDataAsArray = getDataAsArray;
const getOption = (fi, sv, lang, key) => {
    const data = (0, exports.getLocalizedData)(fi, sv, lang);
    if ((0, exports.isKey)(data, key)) {
        return {
            value: key,
            label: data[key],
        };
    }
    return null;
};
exports.getOption = getOption;
const getDataAsOptions = (fi, sv, lang, options) => {
    const data = (0, exports.getLocalizedData)(fi, sv, lang);
    if (options?.filterKeys) {
        return (0, exports.optionsFromObject)(filteredData(data, options.filterKeys));
    }
    return (0, exports.optionsFromObject)(data);
};
exports.getDataAsOptions = getDataAsOptions;
const keys = (obj) => {
    return Object.keys(obj);
};
exports.keys = keys;
const stringKeys = (obj) => {
    return Object.keys(obj);
};
exports.stringKeys = stringKeys;
const isKey = (obj, key) => {
    return key in obj;
};
exports.isKey = isKey;
const findByKey = (arr, obj, key) => {
    return arr.find((item) => item[key] === obj[key]) ?? null;
};
exports.findByKey = findByKey;
const jsonTypeParse = (str) => {
    try {
        const data = JSON.parse(str);
        return data;
    }
    catch {
        return undefined;
    }
};
exports.jsonTypeParse = jsonTypeParse;
const sortDates = (a, b, direction) => {
    if (!a && !b)
        return 0;
    if (!a)
        return 1;
    if (!b)
        return -1;
    switch (direction) {
        case "asc":
            return (0, date_fns_1.compareAsc)(a, b);
        default:
            return (0, date_fns_1.compareDesc)(a, b);
    }
};
exports.sortDates = sortDates;
const sortStrings = (a, b, direction) => {
    if (a === b || (!a && !b))
        return 0;
    if (!a) {
        switch (direction) {
            case "asc":
                return 1;
            default:
                return -1;
        }
    }
    if (!b) {
        switch (direction) {
            case "asc":
                return -1;
            default:
                return 1;
        }
    }
    switch (direction) {
        case "asc":
            return a < b ? -1 : 1;
        default:
            return a < b ? 1 : -1;
    }
};
exports.sortStrings = sortStrings;
const dateString = (date, time) => {
    if (!date)
        return "No date";
    let day = (0, date_fns_1.format)(date, "dd.MM.yyyy");
    if (time) {
        day = `${day} klo ${(0, date_fns_1.format)(date, "HH:mm:ss")}`;
    }
    return day;
};
exports.dateString = dateString;
const getNodeText = (node) => {
    if (node == null)
        return "";
    switch (typeof node) {
        case "string":
        case "number":
            return node.toString();
        case "boolean":
            return "";
        case "object": {
            if (node instanceof Array)
                return node.map(exports.getNodeText).join("");
            if ("props" in node)
                return (0, exports.getNodeText)(node.props.children);
            console.warn("Unresolved `node` of type:", typeof node, node);
            return "";
        } // eslint-ignore-line no-fallthrough
        default:
            console.warn("Unresolved `node` of type:", typeof node, node);
            return "";
    }
};
exports.getNodeText = getNodeText;
const isDateArraySortedByTime = (arr) => {
    let sorted = true;
    for (let i = 0; i < arr.length - 1; i++) {
        const dateA = new Date(`1988-01-13T00:00:00.00`);
        const dateB = new Date(`1988-01-13T00:00:00.00`);
        dateA.setHours(arr[i].getHours(), arr[i].getMinutes());
        dateB.setHours(arr[i + 1].getHours(), arr[i + 1].getMinutes());
        if (dateA.getTime() > dateB.getTime()) {
            sorted = false;
            break;
        }
    }
    return sorted;
};
exports.isDateArraySortedByTime = isDateArraySortedByTime;
//# sourceMappingURL=utils.js.map