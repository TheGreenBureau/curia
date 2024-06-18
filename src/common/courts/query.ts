import fiCourts from "@locales/fi/courts.json";
import svCourts from "@locales/sv/courts.json";
import type { Court } from "data/Court";
import { DropdownOption } from "@purplebureau/sy-react/dist/@types/Dropdown";
import {
  getLocalizedData,
  isKey,
  keys,
  getObjAsOptions,
  Language,
} from "@common/dataUtils";

export const getCourt = (id: string, lang: Language): Court => {
  const courtData = getLocalizedData(fiCourts, svCourts, lang);

  if (isKey(courtData, id)) {
    const court = courtData[id];
    return {
      id: id,
      ...court,
    };
  }

  return null;
};

export const getCourtDetail = (
  courtId: string,
  detailId: string,
  type: "offices" | "departments" | "rooms",
  lang: Language
): string | null => {
  const court = getCourt(courtId, lang);

  if (!court) return null;

  const detail = court[type];

  if (isKey(detail, detailId)) {
    return detail[detailId];
  }

  return null;
};

export const getCourtFirstDetail = (
  courtId: string,
  type: "offices" | "departments" | "rooms",
  lang: Language
): DropdownOption | null => {
  const court = getCourt(courtId, lang);

  if (!court) return null;

  const detail = court[type];
  const keys = Object.keys(detail);

  if (keys.length === 0) return null;

  const firstKey = keys[0];

  if (isKey(detail, firstKey)) {
    return {
      id: firstKey,
      content: detail[firstKey],
    };
  }

  return null;
};

export const getCourtsAsOptions = (lang: Language): DropdownOption[] => {
  const courtData = getLocalizedData(fiCourts, svCourts, lang);
  return keys(courtData).map((dat) => {
    const court = courtData[dat];
    return {
      id: dat,
      content: court.name,
    };
  });
};

type CourtDetailType = "offices" | "departments" | "rooms";

export const getCourtDetailAsOptions = (
  type: CourtDetailType,
  court: Court
): DropdownOption[] => {
  switch (type) {
    case "offices":
      return getObjAsOptions(court.offices);
    case "departments":
      return getObjAsOptions(court.departments);
    default:
      return getObjAsOptions(court.rooms);
  }
};
