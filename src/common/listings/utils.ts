import { getCourt } from "@common/courts/query";
import { courtNotFoundText } from "@common/courts/utils";
import { getOrderedDate } from "@common/dates/format";
import { TableFilter } from "@purplebureau/sy-react/dist/@types/Table";
import { ListingCore } from "data/Listing";

export const formattedListingName = (
  db: ListingCore,
  fileNameDateStart: "year" | "day"
) => {
  if (!db.court) {
    return courtNotFoundText(db.creationDate, fileNameDateStart);
  }

  let fileName = `${db.court.content} ${getOrderedDate(
    db.date,
    fileNameDateStart
  )}`;

  if (db.room) {
    fileName = `${fileName} ${db.room}`;
  }

  return fileName;
};

const filterListing = (
  filter: TableFilter,
  listings: ListingCore[],
  filterFunction: (listing: ListingCore) => boolean
) => {
  if (filter.content === "") return listings;

  return listings.filter((l) => filterFunction(l));
};

export const filterForQuery = (
  infos: ListingCore[],
  filters: TableFilter[],
  fileNameStart: "year" | "day" = "day",
  lang: string
): ListingCore[] => {
  if (!filters || filters.length === 0) {
    return infos;
  }

  let filtered = [...infos];
  filters.forEach((filter) => {
    if (filter.headerId === "court") {
      filtered = filterListing(filter, filtered, (l) => {
        if (!l.court) return false;
        const court = getCourt(l.court.id, lang);
        if (!court) return false;

        return (
          court.name.toLowerCase().includes(filter.content.toLowerCase()) ||
          court.abbreviation
            .toLowerCase()
            .includes(filter.content.toLowerCase())
        );
      });
    }

    if (filter.headerId === "date") {
      filtered = filterListing(filter, filtered, (l) => {
        if (!l.date) return false;
        return getOrderedDate(l.date, fileNameStart)
          .toLowerCase()
          .includes(filter.content.toLowerCase());
      });
    }

    if (filter.headerId === "department") {
      filtered = filterListing(filter, filtered, (l) => {
        if (!l.department) return false;
        return l.department.content
          .toLowerCase()
          .includes(filter.content.toLowerCase());
      });
    }

    if (filter.headerId === "room") {
      filtered = filterListing(filter, filtered, (l) => {
        if (!l.room) return false;
        return l.room.content
          .toLowerCase()
          .includes(filter.content.toLowerCase());
      });
    }

    if (filter.headerId === "creation") {
      filtered = filterListing(filter, filtered, (l) => {
        return getOrderedDate(l.creationDate, fileNameStart, true)
          .toLowerCase()
          .includes(filter.content.toLowerCase());
      });
    }
  });

  return filtered;
};
