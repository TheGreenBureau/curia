import { courtNotFoundText } from "@common/courts/utils";
import { getOrderedDate } from "@common/dates/format";
import { TableCell, TableRow } from "@purplebureau/sy-react/dist/@types/Table";
import { ListingCore } from "data/Listing";

export const listingsAsRows = (
  listings: ListingCore[],
  fileNameDateStart?: "year" | "day"
) => {
  return listings.map((core) => {
    const courtCell: TableCell = {
      id: core.court ? core.court.id : `${core.id}-court-${core.creationDate}`,
      content: core.court ? core.court.content : "-",
    };
    const dateCell: TableCell = {
      id: core.date
        ? `${core.date}-${core.creationDate}`
        : `${core.id}-date-${core.creationDate}`,
      content: core.date ? getOrderedDate(core.date, fileNameDateStart) : "-",
    };
    const departmentCell: TableCell = {
      id: core.department
        ? core.department.id
        : `${core.id}-department-${core.creationDate}`,
      content: core.department ? core.department.content : "-",
    };
    const roomCell: TableCell = {
      id: core.room ? core.room.id : `${core.id}-room-${core.creationDate}`,
      content: core.room ? core.room.content : "-",
    };
    const creationDateCell: TableCell = {
      id: `${core.id}-creation-${core.creationDate}`,
      content: getOrderedDate(core.creationDate, fileNameDateStart, true),
    };

    const listingRow: TableRow = {
      id: core.id,
      cells: [courtCell, dateCell, departmentCell, roomCell, creationDateCell],
    };

    return listingRow;
  });
};
