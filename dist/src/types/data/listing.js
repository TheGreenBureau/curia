"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingSchema = void 0;
const case_1 = require("@/types/data/case");
const zod_1 = require("zod");
exports.ListingSchema = zod_1.z.object({
    id: zod_1.z.string(),
    creationDate: zod_1.z.coerce.date(),
    date: zod_1.z.coerce.date(),
    court: zod_1.z.string(),
    office: zod_1.z.string(),
    department: zod_1.z.string(),
    room: zod_1.z.string(),
    cases: case_1.CaseSchema.array(),
    break: zod_1.z.coerce.date().optional(),
    notes: zod_1.z.string().optional(),
    notePublicity: case_1.NotePublicitySchema.optional(),
});
//# sourceMappingURL=listing.js.map