import i18n from "i18next";
import fiCourts from "../locales/fi/courts.json";
import svCourts from "../locales/sv/courts.json";
import { Court } from "data/Court";
import { DropdownOption } from "@purplebureau/sy-react/dist/@types/Dropdown";

const getLocalizedCourtData = () => {
  const lang = i18n.resolvedLanguage;

  let courts: typeof fiCourts;

  if (lang === "sv") {
    courts = svCourts;
  }

  if (!courts) {
    courts = fiCourts;
  }

  return courts;
};

export const getCourt = (id: string): Court => {
  const courts = getLocalizedCourtData();

  if (Object.keys(courts).includes(id)) {
    const court = courts[id as keyof typeof courts];
    return {
      id: id,
      ...court,
    };
  }

  return;
};

export const getCourtNames = (): string[] => {
  const courts = getLocalizedCourtData();
  return Object.values(courts).map((value) => value.name);
};

export const getCourtsAsOptions = (): DropdownOption[] => {
  const courts = getLocalizedCourtData();
  return Object.keys(courts).map((key) => {
    const court = courts[key as keyof typeof courts];
    return {
      id: key,
      content: court.name,
    };
  });
};
