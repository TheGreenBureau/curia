import { StaffMember } from "data/Persons";

export type Defaults = {
  courtId?: string;
  officeId?: string;
  departmentId?: string;
  roomId?: string;
  presiding?: StaffMember;
  secretary?: StaffMember;
  break?: Date;
};

export interface AppConfig {
  readonly creationTime: Date;
  readonly modificationTime: Date;
  readonly dbDirectory: string;
  readonly defaults: Defaults;
  readonly fileNameDateStart: "year" | "day";
}
