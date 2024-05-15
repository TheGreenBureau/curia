import { ListingCore } from "data/Listing";
import { t } from "i18next";
import { getCourt } from "./courts";
import { format } from "date-fns";

const getOrderedDate = (
  date: Date,
  fileNameDateStart: "year" | "day",
  time?: boolean
) => {
  let day =
    fileNameDateStart === "year"
      ? format(date, "yyyy-MM-dd")
      : format(date, "dd.MM.yyyy");

  if (time) {
    day = `${day} klo ${format(date, "HH:mm:ss")}`;
  }

  return day;
};

const courtNotFoundText = (
  creation: Date,
  fileNameDateStart: "year" | "day"
) => {
  return `${t("files:filenameNoCourtFound")} ${getOrderedDate(
    creation,
    fileNameDateStart,
    true
  )}`;
};

export const formattedListingName = (
  db: ListingCore,
  fileNameDateStart: "year" | "day"
) => {
  if (!db.courtId) {
    return courtNotFoundText(db.creationDate, fileNameDateStart);
  }

  const court = getCourt(db.courtId);

  if (!court) {
    return courtNotFoundText(db.creationDate, fileNameDateStart);
  }

  let fileName = `${court.name} ${getOrderedDate(db.date, fileNameDateStart)}`;

  if (db.roomId) {
    const room = court.rooms[db.roomId];

    if (room) {
      fileName = `${fileName} ${room}`;
    }
  }

  return fileName;
};
