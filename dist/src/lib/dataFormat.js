"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCourtChoices = exports.optionsFromCourtValues = exports.sortCivilians = exports.sortOfficers = exports.formatListingName = exports.optionsFromData = exports.optionsFromRecord = void 0;
const utils_1 = require("@/lib/utils");
const react_i18next_1 = require("react-i18next");
const useResources_1 = require("@/hooks/useResources");
const optionsFromRecord = (data) => {
    if (!data) {
        return [];
    }
    return (0, utils_1.keys)(data).map((key) => {
        return {
            value: key,
            label: data[key],
        };
    });
};
exports.optionsFromRecord = optionsFromRecord;
const optionsFromData = (data) => {
    return data.map((d) => {
        return {
            value: d.id,
            label: d.name,
        };
    });
};
exports.optionsFromData = optionsFromData;
const formatListingName = (listing) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const resources = (0, useResources_1.useResources)();
    if (!listing.court) {
        return `${t("Juttuluettelo")} ${(0, utils_1.dateString)(listing.creationDate)}`;
    }
    const court = resources.data?.courts.find((c) => c.id === listing.court);
    const office = court && court.offices.find((o) => o.id === listing.court);
    const room = court && office && office.rooms.find((r) => r.id === listing.room);
    let fileName = `${court?.name ?? ""} | ${(0, utils_1.dateString)(listing.date)}`;
    if (room) {
        fileName = `${fileName} | ${room.name}`;
    }
    return fileName;
};
exports.formatListingName = formatListingName;
const nameSort = (a, b, lang) => {
    return a.name.localeCompare(b.name, lang);
};
const sortOfficers = (a, b, lang) => {
    if (a.type === b.type) {
        return nameSort(a, b, lang);
    }
    switch (a.type) {
        case "presiding":
            return -1;
        case "secretary":
            switch (b.type) {
                case "presiding":
                    return 1;
                default:
                    return -1;
            }
        case "member":
            switch (b.type) {
                case "presiding":
                case "secretary":
                    return 1;
                default:
                    return -1;
            }
        case "layman":
            switch (b.type) {
                case "presiding":
                case "secretary":
                case "member":
                    return 1;
                default:
                    return -1;
            }
        default:
            return 1;
    }
};
exports.sortOfficers = sortOfficers;
const sortCivilians = (a, b, lang) => {
    if (a.type === b.type) {
        return nameSort(a, b, lang);
    }
    switch (a.type) {
        case "defendant":
            return -1;
        case "plaintiff":
            switch (b.type) {
                case "defendant":
                    return 1;
                default:
                    return -1;
            }
        case "injured":
            switch (b.type) {
                case "defendant":
                case "plaintiff":
                    return 1;
                default:
                    return -1;
            }
        case "witness":
            switch (b.type) {
                case "expert":
                    return -1;
                default:
                    return 1;
            }
        default:
            return 1;
    }
};
exports.sortCivilians = sortCivilians;
const optionsFromCourtValues = (values, resources) => {
    const currentCourt = resources.courts.find((c) => c.id === values.court);
    const currentOffice = currentCourt
        ? currentCourt.offices.find((o) => o.id === values.office)
        : null;
    const options = {
        courts: (0, exports.optionsFromData)(resources.courts),
        departments: currentCourt ? (0, exports.optionsFromData)(currentCourt.departments) : [],
        offices: currentCourt ? (0, exports.optionsFromData)(currentCourt.offices) : [],
        rooms: currentOffice ? (0, exports.optionsFromData)(currentOffice.rooms) : [],
    };
    return { options, currentCourt, currentOffice };
};
exports.optionsFromCourtValues = optionsFromCourtValues;
const validateCourtChoices = (values, departments) => {
    let valid = true;
    if (values.court === "" || values.office === "" || values.room === "") {
        valid = false;
    }
    if (values.department === "" && departments.length > 0) {
        valid = false;
    }
    return valid;
};
exports.validateCourtChoices = validateCourtChoices;
//# sourceMappingURL=dataFormat.js.map