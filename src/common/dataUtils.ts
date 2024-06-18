import { DropdownOption } from "@purplebureau/sy-react/dist/@types/Dropdown";

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
