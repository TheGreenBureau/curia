import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Option } from "@/types/data/options";
import { compareAsc, compareDesc, format } from "date-fns";
import type { ArrayOptions, SortDirection } from "@/types/data/queries";
import { Listing } from "@/types/data/listing";
import i18next, { t } from "i18next";
import { getCourt, getCourts } from "./staticData/courts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLocalizedData = <T>(fi: T, sv: T, lang: string): T => {
  if (lang === "sv") {
    return sv;
  }

  return fi;
};

const filteredData = <T>(data: T, filterKeys: (keyof T)[]) => {
  return Object.fromEntries(filterKeys.map((k) => [k, data[k]]));
};

export const optionsFromObject = <T extends Record<string, string>>(
  data: T
): Option[] => {
  return Object.keys(data).map((key) => {
    return {
      value: key,
      label: data[key],
    };
  });
};

export const getDataAsArray = <T extends Record<string, string>>(
  fi: T,
  sv: T,
  lang: string,
  options?: ArrayOptions<T>
): string[] => {
  const data = getLocalizedData(fi, sv, lang);

  if (options?.filterKeys) {
    return Object.values(filteredData(data, options.filterKeys));
  }

  return Object.values(data);
};

export const getOption = <T extends Record<string, string>>(
  fi: T,
  sv: T,
  lang: string,
  key: string
): Option | null => {
  const data = getLocalizedData(fi, sv, lang);

  if (isKey(data, key)) {
    return {
      value: key,
      label: data[key],
    };
  }

  return null;
};

export const getDataAsOptions = <T extends Record<string, string>>(
  fi: T,
  sv: T,
  lang: string,
  options?: ArrayOptions<T>
): Option[] => {
  const data = getLocalizedData(fi, sv, lang);

  if (options?.filterKeys) {
    return optionsFromObject(filteredData(data, options.filterKeys));
  }

  return optionsFromObject(data);
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

export const dateString = (date: Date, time?: boolean) => {
  if (!date) return "No date";

  let day = format(date, "dd.MM.yyyy");

  if (time) {
    day = `${day} klo ${format(date, "HH:mm:ss")}`;
  }

  return day;
};

export const formatListingName = (listing: Listing) => {
  if (!listing.court) {
    return `${t("strings:Juttuluettelo")} ${dateString(listing.creationDate)}`;
  }

  const court = getCourt(listing.court, i18next.resolvedLanguage);

  const room = court
    ? isKey(court.rooms, listing.room)
      ? court.rooms[listing.room]
      : ""
    : "";

  let fileName = `${court?.name ?? ""} | ${dateString(listing.date)}`;

  if (room !== "") {
    fileName = `${fileName} | ${room}`;
  }

  return fileName;
};

export const getNodeText = (node: React.ReactNode): string => {
  if (node == null) return "";

  switch (typeof node) {
    case "string":
    case "number":
      return node.toString();

    case "boolean":
      return "";

    case "object": {
      if (node instanceof Array) return node.map(getNodeText).join("");

      if ("props" in node) return getNodeText(node.props.children);

      console.warn("Unresolved `node` of type:", typeof node, node);
      return "";
    } // eslint-ignore-line no-fallthrough

    default:
      console.warn("Unresolved `node` of type:", typeof node, node);
      return "";
  }
};
