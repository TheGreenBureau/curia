import fiCourts from "@/locales/fi/courts.json";
import svCourts from "@/locales/sv/courts.json";
import { Court, CourtDetailType, Office } from "@/types/data/court";
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

export const getCourtDepartment = (
  courtId: string | undefined,
  departmentId: string | undefined,
  lang: string
): string => {
  if (!courtId || !departmentId) {
    return "";
  }

  const court = getCourt(courtId, lang);
  if (!court) return "";

  if (isKey(court.departments, departmentId)) {
    return court.departments[departmentId];
  }

  return "";
};

export const getCourtOffice = (
  courtId: string | undefined,
  officeId: string | undefined,
  lang: string
): string => {
  if (!courtId || !officeId) {
    return "";
  }

  const court = getCourt(courtId, lang);
  if (!court) return "";

  if (isKey(court.offices, officeId)) {
    return court.offices[officeId].name;
  }

  return "";
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

export const getCourtDepartments = (court: Court): Option[] => {
  return optionsFromObject(court.departments);
};

export const getCourtOffices = (court: Court): Option[] => {
  return Object.keys(court.offices).map((k) => {
    return {
      value: k,
      label: court.offices[k].name,
    };
  });
};

export const getOfficeRooms = (office: Office): Option[] => {
  return optionsFromObject(office.rooms);
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
