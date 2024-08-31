import fiCourts from "@/locales/fi/courts.json";
import svCourts from "@/locales/sv/courts.json";
import { Court, CourtDetailType } from "@/types/data/court";
import { Option } from "@/types/data/options";
import { getLocalizedData, isKey, keys, optionsFromObject } from "@/lib/utils";

export const getCourt = (
  id: string | undefined | null,
  lang: string
): Court | null => {
  if (!id) {
    return null;
  }

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
  courtId: string | undefined,
  detailId: string | undefined,
  type: CourtDetailType,
  lang: string
): string => {
  if (!courtId || !detailId) {
    return "";
  }

  const court = getCourt(courtId, lang);
  if (!court) return "";

  const detail = court[type];

  if (isKey(detail, detailId)) {
    return detail[detailId];
  }

  return "";
};

export const getCourtFirstDetail = (
  courtId: string,
  type: CourtDetailType,
  lang: string
): Option | null => {
  const court = getCourt(courtId, lang);

  if (!court) return null;

  const detail = court[type];
  const keys = Object.keys(detail);

  if (keys.length === 0) return null;

  return {
    value: keys[0],
    label: detail[keys[0]],
  };
};

export const getCourts = (lang: string): Option[] => {
  const courtData = getLocalizedData(fiCourts, svCourts, lang);

  return keys(courtData).map((dat) => {
    const court = courtData[dat];
    return {
      value: dat,
      label: court.name,
    };
  });
};

export const getCourtDetails = (
  type: CourtDetailType,
  court: Court
): Option[] => {
  return optionsFromObject(court[type]);
};

export const getCourtsFull = (lang: string) => {
  const courtData = getLocalizedData(fiCourts, svCourts, lang);

  return Object.keys(courtData).map((key) => {
    const court: Court = {
      id: key,
      ...courtData[key as keyof typeof courtData],
    };

    return court;
  });
};
