"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CivilianSchema = exports.summonsStatuses = exports.allSummons = exports.OtherSummonsSchema = exports.otherSummons = exports.DefendantSummonsSchema = exports.defendantSummons = exports.CivilianTypeSchema = exports.civilianTypes = exports.OfficerSchema = exports.OfficerTypeSchema = exports.officerTypes = exports.PersonBaseSchema = void 0;
const zod_1 = require("zod");
exports.PersonBaseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
});
exports.officerTypes = [
    "presiding",
    "secretary",
    "member",
    "layman",
    "prosecutor",
];
exports.OfficerTypeSchema = zod_1.z.enum(exports.officerTypes);
exports.OfficerSchema = exports.PersonBaseSchema.extend({
    type: exports.OfficerTypeSchema,
    title: zod_1.z.string().optional(),
});
exports.civilianTypes = [
    "defendant",
    "injured",
    "witness",
    "expert",
    "plaintiff",
];
exports.CivilianTypeSchema = zod_1.z.enum(exports.civilianTypes);
const commonSummons = ["personal", "video"];
const defendantSpecificSummons = ["three", "nine"];
const otherSpecificSummons = ["phone"];
exports.defendantSummons = [
    ...commonSummons,
    ...defendantSpecificSummons,
];
exports.DefendantSummonsSchema = zod_1.z.enum(exports.defendantSummons);
exports.otherSummons = [
    ...commonSummons,
    ...otherSpecificSummons,
];
exports.OtherSummonsSchema = zod_1.z.enum(exports.otherSummons);
exports.allSummons = [
    ...commonSummons,
    ...defendantSpecificSummons,
    ...otherSpecificSummons,
];
exports.summonsStatuses = [
    "success",
    "failure",
    "warrant",
    "fetch",
];
exports.CivilianSchema = exports.PersonBaseSchema.extend({
    type: exports.CivilianTypeSchema,
    counselor: zod_1.z.string().optional(),
    trustee: zod_1.z.string().optional(),
    representative: zod_1.z.string().optional(),
    hasDemands: zod_1.z.boolean().optional(),
    summonsType: zod_1.z.enum(exports.allSummons).optional(),
    summonsStatus: zod_1.z.enum(exports.summonsStatuses).optional(),
});
//# sourceMappingURL=persons.js.map