import { Listing } from "@/types/data/listing";
import { dateString, keys } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useResources } from "@/hooks/useResources";
import { Option } from "@/types/data/options";
import { Base } from "@/types/data/queries";

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
