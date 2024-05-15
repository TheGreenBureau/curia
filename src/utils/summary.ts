import { getCourt } from "./courts";
import { ListingCore, ListingSummary } from "data/Listing";
import { v4 as uuidv4 } from "uuid";

export const getSummary = (core: ListingCore): ListingSummary => {
  const court = getCourt(core.courtId);

  return {
    id: uuidv4(),
    creationDate: core.creationDate,
    date: core.date,
    courtAbbreviation: court.abbreviation,
    officeName: core.officeId && court.offices[core.officeId],
    departmentName: core.departmentId && court.departments[core.departmentId],
    roomName: core.roomId && court.rooms[core.roomId],
  };
};
