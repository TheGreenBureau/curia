"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCSV = void 0;
const sync_1 = require("csv-parse/sync");
const case_1 = require("@/types/data/case");
const uuid_1 = require("uuid");
const immer_1 = require("immer");
const parseCSV = (csv, type, defaults, currentListing) => {
    const parsed = (0, sync_1.parse)(csv, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ";",
    });
    if (!Array.isArray(parsed)) {
        throw new Error("Invalid CSV-file.");
    }
    const cases = [];
    const errors = [];
    for (let line of parsed) {
        if ((0, case_1.isCaseCSV)(line)) {
            cases.push(processCSVLine(line, type, defaults));
            continue;
        }
        errors.push(JSON.stringify(line, null, 2));
    }
    const listingUpdatedCases = processCases(cases, currentListing, defaults);
    return {
        cases: listingUpdatedCases,
        errors: errors,
    };
};
exports.parseCSV = parseCSV;
const processCSVLine = (line, type, defaults) => {
    const dateparts = line.päiväys.trim().split(".");
    const timeparts = line.alkamiskelloaika.trim().split(":");
    const date = new Date();
    date.setFullYear(parseInt(dateparts[2]), parseInt(dateparts[1]), parseInt(dateparts[0]));
    date.setHours(parseInt(timeparts[0]), parseInt(timeparts[1]), 0, 0);
    const { prosecutors, plaintiffs } = processBearers(line.esittäjät, defaults);
    const current = {
        id: (0, uuid_1.v4)(),
        caseNumber: line["asia ID"].trim(),
        prosecutorCaseNumber: line["syyttäjän asia ID"].trim(),
        matter: line.asianimike.trim(),
        time: date,
        type: type,
        officers: [...prosecutors],
        civilians: [...processCivilians(line.kohteet), ...plaintiffs],
        csv: true,
    };
    return current;
};
const processBearers = (plaints, defaults) => {
    const prosecutors = [];
    const plaintiffs = [];
    const prosecPos = ["syyttäjä"];
    const plaintiffPos = ["kantaja"];
    const personsWithTitles = plaints.split(",");
    for (let person of personsWithTitles) {
        const parts = person.split(" ").map((part) => part.trim());
        const positionString = parts.pop();
        if (!positionString) {
            continue;
        }
        if (prosecPos.includes(positionString.toLowerCase())) {
            prosecutors.push({
                id: (0, uuid_1.v4)(),
                name: parts.join(" "),
                type: "prosecutor",
                title: defaults.prosecutors,
            });
        }
        else if (plaintiffPos.includes(positionString.toLowerCase())) {
            plaintiffs.push({
                id: (0, uuid_1.v4)(),
                name: parts.join(" "),
                type: "plaintiff",
            });
        }
    }
    return {
        prosecutors,
        plaintiffs,
    };
};
const processCivilians = (civs) => {
    const positions = [
        { variants: ["vastaaja"], position: "defendant" },
        { variants: ["asianomistaja"], position: "injured" },
        { variants: ["todistaja"], position: "witness" },
    ];
    return civs.split(",").map((person) => {
        const parts = person.split(" ").map((part) => part.trim());
        const positionString = parts.pop() ?? "";
        const position = positions.find((p) => p.variants.includes(positionString.toLowerCase()));
        const civilian = {
            id: (0, uuid_1.v4)(),
            name: parts.join(" "),
            type: position ? position.position : "defendant",
        };
        return civilian;
    });
};
const processCases = (csvCases, currentListing, defaults) => {
    // Filter deleted cases
    const results = currentListing.cases.filter((c) => !c.csv || csvCases.some((csv) => csv.caseNumber === c.caseNumber));
    // Add new cases and modify existing
    for (let csv of csvCases) {
        const currentCase = currentListing.cases.find((c) => c.caseNumber === csv.caseNumber);
        if (!currentCase) {
            results.push({
                ...csv,
                officers: [
                    defaults.presiding,
                    defaults.secretary,
                    ...csv.officers,
                ].filter((o) => o !== null),
            });
            continue;
        }
        const resultCase = (0, immer_1.produce)(currentCase, (draft) => {
            draft.matter = csv.matter;
            draft.time = csv.time;
            draft.prosecutorCaseNumber = csv.prosecutorCaseNumber;
            draft.officers = updatedProsecutors(currentCase.officers, csv.officers);
            draft.civilians = updatedCivilians(currentCase.civilians, csv.civilians);
        });
        const resultIndex = results.findIndex((c) => c.id === currentCase.id);
        results[resultIndex] = resultCase;
    }
    return results;
};
const updatedProsecutors = (currentOfficers, csvProsecutors) => {
    return [
        ...currentOfficers.filter((o) => o.type !== "prosecutor"),
        ...csvProsecutors,
    ];
};
const updatedCivilians = (currentCivilians, csvCivilians) => {
    const result = currentCivilians.filter((civilian) => civilian.type !== "defendant" ||
        csvCivilians.some((csvCiv) => csvCiv.name === civilian.name));
    for (let civilian of csvCivilians) {
        if (currentCivilians.some((civ) => civ.name === civilian.name && civ.type === civilian.type)) {
            continue;
        }
        result.push(civilian);
    }
    return result;
};
//# sourceMappingURL=csv.js.map