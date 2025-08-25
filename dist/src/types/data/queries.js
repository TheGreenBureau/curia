"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordSchema = exports.BaseSchema = void 0;
const zod_1 = require("zod");
exports.BaseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
});
exports.RecordSchema = zod_1.z.record(zod_1.z.string(), zod_1.z.string());
//# sourceMappingURL=queries.js.map