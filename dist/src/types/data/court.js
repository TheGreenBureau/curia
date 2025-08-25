"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllCourtsSchema = exports.CourtSchema = exports.OfficeSchema = void 0;
const zod_1 = require("zod");
const queries_1 = require("@/types/data/queries");
exports.OfficeSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    rooms: queries_1.BaseSchema.array(),
});
exports.CourtSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    abbreviation: zod_1.z.string(),
    offices: exports.OfficeSchema.array(),
    departments: queries_1.BaseSchema.array(),
});
exports.AllCourtsSchema = exports.CourtSchema.array();
//# sourceMappingURL=court.js.map