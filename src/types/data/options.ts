export type Option = {
  value: string;
  label: string;
};

export type Courts = {
  courts: Option[];
  offices: Option[];
  departments: Option[];
  rooms: Option[];
};

export type Titles = {
  court: Option[];
  layman: Option[];
  prosecutor: Option[];
};

export type CivilianOptions = {
  defendantSummons: Option[];
  otherSummons: Option[];
  summonsStatuses: Option[];
  civilPositions: Option[];
  criminalPositions: Option[];
};
