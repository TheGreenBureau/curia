"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourcesSchema = void 0;
const zod_1 = require("zod");
const court_1 = require("./court");
const queries_1 = require("./queries");
exports.ResourcesSchema = zod_1.z.object({
    courts: court_1.AllCourtsSchema,
    civilianPositions: queries_1.RecordSchema,
    officerPositions: queries_1.RecordSchema,
    positionAbbreviations: queries_1.RecordSchema,
    summons: queries_1.RecordSchema,
    summonsStatus: queries_1.RecordSchema,
    courtTitles: queries_1.RecordSchema,
    laymanTitles: queries_1.RecordSchema,
    prosecutorTitles: queries_1.RecordSchema,
});
//# sourceMappingURL=resources.js.map