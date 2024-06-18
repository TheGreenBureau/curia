import { getOrderedDate } from "@common/dates/format";
import { t } from "i18next";

export const courtNotFoundText = (
  creation: Date,
  fileNameDateStart: "year" | "day"
) => {
  return `${t("files:filenameNoCourtFound")} ${getOrderedDate(
    creation,
    fileNameDateStart,
    true
  )}`;
};
