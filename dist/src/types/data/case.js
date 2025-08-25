"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCaseCSV = exports.CaseSchema = exports.NotePublicitySchema = exports.notePublicityTypes = exports.caseType = void 0;
const persons_1 = require("./persons");
const zod_1 = require("zod");
exports.caseType = ["criminal", "civil"];
exports.notePublicityTypes = ["private", "public", "prosecutor"];
exports.NotePublicitySchema = zod_1.z.enum(exports.notePublicityTypes);
exports.CaseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    caseNumber: zod_1.z.string(),
    prosecutorCaseNumber: zod_1.z.string(),
    matter: zod_1.z.string(),
    time: zod_1.z.coerce.date(),
    type: zod_1.z.enum(exports.caseType),
    officers: persons_1.OfficerSchema.array(),
    civilians: persons_1.CivilianSchema.array(),
    confidential: zod_1.z.boolean().optional(),
    csv: zod_1.z.boolean().optional(),
    notes: zod_1.z.string().optional(),
    notePublicity: exports.NotePublicitySchema.optional(),
});
const isCaseCSV = (input) => {
    const schema = {
        "asia ID": true,
        asianimike: true,
        päiväys: true,
        alkamiskelloaika: true,
        "istunnon tyyppi": true,
        salitieto: true,
        esittäjät: true,
        kohteet: true,
        "syyttäjän asia ID": true,
    };
    const missingProperties = Object.keys(schema)
        .filter((key) => input[key] === undefined)
        .map((key) => key);
    if (missingProperties.length > 0) {
        throw new Error(`CSV document is missing the following properties: ${JSON.stringify(missingProperties)}`);
    }
    return true;
};
exports.isCaseCSV = isCaseCSV;
//# sourceMappingURL=case.js.map