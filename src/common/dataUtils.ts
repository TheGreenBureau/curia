import { DropdownOption } from "@purplebureau/sy-react/dist/@types/Dropdown";
import { SortDirection } from "@purplebureau/sy-react/dist/@types/Table";
import { compareAsc, compareDesc } from "date-fns";

export type Language = string;

export const getLocalizedData = <T>(fi: T, sv: T, lang: Language): T => {
  if (lang === "sv") {
    return sv;
  }

  return fi;
};

export const getAsArray = <T extends Record<string, string>>(
  fi: T,
  sv: T,
  lang: Language
): string[] => {
  const data = getLocalizedData(fi, sv, lang);
  return Object.values(data);
};

export const getAsOptions = <T extends Record<string, string>>(
  fi: T,
  sv: T,
  lang: Language
): DropdownOption[] => {
  const data = getLocalizedData(fi, sv, lang);
  return Object.keys(data).map((key) => {
    const dataPoint = data[key];
    return {
      id: key,
      content: dataPoint,
    };
  });
};

export const getOption = <T extends Record<string, string>>(
  fi: T,
  sv: T,
  lang: Language,
  key: string
): DropdownOption | null => {
  const data = getLocalizedData(fi, sv, lang);

  if (isKey(data, key)) {
    return {
      id: key,
      content: data[key],
    };
  }

  return null;
};

export const getObjAsOptions = <T extends Record<string, string>>(
  obj: T
): DropdownOption[] => {
  return Object.keys(obj).map((key) => {
    return {
      id: key,
      content: obj[key],
    };
  });
};

export const keys = <T extends object>(obj: T) => {
  return Object.keys(obj) as Array<keyof T>;
};

export const stringKeys = <T extends Record<string, any>>(
  obj: T
): (keyof T & string)[] => {
  return Object.keys(obj) as Array<keyof T & string>;
};

export const isKey = <T extends object>(
  obj: T,
  key: PropertyKey
): key is keyof T => {
  return key in obj;
};

export const findByKey = <T, K extends keyof T>(arr: T[], obj: T, key: K) => {
  return arr.find((item) => item[key] === obj[key]) ?? null;
};

export const jsonTypeParse = <T>(str: string) => {
  try {
    const data: T = JSON.parse(str);
    return data;
  } catch {
    return undefined;
  }
};

export const setAllNull = <T>(obj: T) => {
  Object.keys(obj).forEach((key) => (obj[key as keyof T] = null));
};

export const sortDates = (
  a: Date | undefined | null,
  b: Date | undefined | null,
  direction: SortDirection
) => {
  if (!a && !b) return 0;

  switch (direction) {
    case "asc":
      return compareAsc(a, b);
    default:
      return compareDesc(a, b);
  }
};

export const sortStrings = (
  a: string | undefined | null,
  b: string | undefined | null,
  direction: SortDirection
) => {
  if (a === b || (!a && !b)) return 0;

  if (!a) {
    switch (direction) {
      case "asc":
        return 1;
      default:
        return -1;
    }
  }

  if (!b) {
    switch (direction) {
      case "asc":
        return -1;
      default:
        return 1;
    }
  }

  switch (direction) {
    case "asc":
      return a < b ? -1 : 1;
    default:
      return a < b ? 1 : -1;
  }
};
