import { Listing } from "@/types/data/listing";
import { dateString, keys } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useResources } from "@/hooks/useResources";
import { Option } from "@/types/data/options";
import { Base } from "@/types/data/queries";
import { Civilian, Officer } from "@/types/data/persons";
import { CourtValues } from "@/types/data/court";
import { Resources } from "@/types/data/resources";

export const optionsFromRecord = (
  data: Record<string, string> | undefined | null
): Option[] => {
  if (!data) {
    return [];
  }

  return keys(data).map((key) => {
    return {
      value: key,
      label: data[key],
    };
  });
};

export const optionsFromData = <Data extends Base>(data: Data[]): Option[] => {
  return data.map((d) => {
    return {
      value: d.id,
      label: d.name,
    };
  });
};

export const formatListingName = (listing: Listing) => {
  const { t } = useTranslation();
  const resources = useResources();

  if (!listing.court) {
    return `${t("Juttuluettelo")} ${dateString(listing.creationDate)}`;
  }

  const court = resources.data?.courts.find((c) => c.id === listing.court);
  const office = court && court.offices.find((o) => o.id === listing.court);
  const room =
    court && office && office.rooms.find((r) => r.id === listing.room);

  let fileName = `${court?.name ?? ""} | ${dateString(listing.date)}`;

  if (room) {
    fileName = `${fileName} | ${room.name}`;
  }

  return fileName;
};

const nameSort = <Person extends { name: string }>(
  a: Person,
  b: Person,
  lang: string
) => {
  return a.name.localeCompare(b.name, lang);
};

export const sortOfficers = (a: Officer, b: Officer, lang: string) => {
  if (a.type === b.type) {
    return nameSort(a, b, lang);
  }

  switch (a.type) {
    case "presiding":
      return -1;
    case "secretary":
      switch (b.type) {
        case "presiding":
          return 1;
        default:
          return -1;
      }
    case "member":
      switch (b.type) {
        case "presiding":
        case "secretary":
          return 1;
        default:
          return -1;
      }
    case "layman":
      switch (b.type) {
        case "presiding":
        case "secretary":
        case "member":
          return 1;
        default:
          return -1;
      }
    default:
      return 1;
  }
};

export const sortCivilians = (a: Civilian, b: Civilian, lang: string) => {
  if (a.type === b.type) {
    return nameSort(a, b, lang);
  }

  switch (a.type) {
    case "defendant":
      return -1;
    case "plaintiff":
      switch (b.type) {
        case "defendant":
          return 1;
        default:
          return -1;
      }
    case "injured":
      switch (b.type) {
        case "defendant":
        case "plaintiff":
          return 1;
        default:
          return -1;
      }
    case "witness":
      switch (b.type) {
        case "expert":
          return -1;
        default:
          return 1;
      }
    default:
      return 1;
  }
};

export const optionsFromCourtValues = (
  values: CourtValues,
  resources: Resources
) => {
  const currentCourt = resources.courts.find((c) => c.id === values.court);

  const currentOffice = currentCourt
    ? currentCourt.offices.find((o) => o.id === values.office)
    : null;

  const options = {
    courts: optionsFromData(resources.courts),
    departments: currentCourt ? optionsFromData(currentCourt.departments) : [],
    offices: currentCourt ? optionsFromData(currentCourt.offices) : [],
    rooms: currentOffice ? optionsFromData(currentOffice.rooms) : [],
  };

  return { options, currentCourt, currentOffice };
};

export const validateCourtChoices = (
  values: CourtValues,
  departments: Option[]
) => {
  let valid = true;

  if (values.court === "" || values.office === "" || values.room === "") {
    valid = false;
  }

  if (values.department === "" && departments.length > 0) {
    valid = false;
  }

  return valid;
};
