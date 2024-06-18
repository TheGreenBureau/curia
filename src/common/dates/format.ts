import { format } from "date-fns";

export const getOrderedDate = (
  date: Date,
  fileNameDateStart?: "year" | "day",
  time?: boolean
) => {
  if (!date) return "No date";
  let day =
    fileNameDateStart && fileNameDateStart === "year"
      ? format(date, "yyyy-MM-dd")
      : format(date, "dd.MM.yyyy");

  if (time) {
    day = `${day} klo ${format(date, "HH:mm:ss")}`;
  }

  return day;
};
