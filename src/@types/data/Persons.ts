import courtTitles from "../../locales/fi/courtTitles.json";
import prosecutorTitles from "../../locales/fi/prosecutorTitles.json";
import defendantSummonsTypes from "../../locales/fi/defendantSummonsTypes.json";
import genericSummonsTypes from "../../locales/fi/genericSummonsTypes.json";
import summonsStatus from "../../locales/fi/summonsStatus.json";

type PersonBase = {
  id: string;
  name: string;
};

export type Counselor = PersonBase;

export type Trustee = PersonBase & {
  title?: string;
};

export type StaffMember = PersonBase & {
  title: keyof typeof courtTitles;
};

export type Prosecutor = PersonBase & {
  title?: keyof typeof prosecutorTitles;
};

export type Plaintiff = PersonBase;

export type Defendant = PersonBase & {
  counselor?: Counselor;
  trustee?: Trustee;
  summonsType?: keyof typeof defendantSummonsTypes;
  summonsStatus?: keyof typeof summonsStatus;
};

export type InjuredRepresentative = PersonBase;

export type Injured = PersonBase & {
  counselor?: Counselor;
  representative?: InjuredRepresentative;
  trustee?: Trustee;
  hasDemands?: boolean;
  summonsType?: keyof typeof genericSummonsTypes;
  summonsStatus?: keyof typeof summonsStatus;
};

export type Witness = PersonBase & {
  summonsType?: keyof typeof genericSummonsTypes;
  summonsStatus?: keyof typeof summonsStatus;
};

export type Expert = PersonBase & {
  title?: string;
  summonsType?: keyof typeof genericSummonsTypes;
  summonsStatus?: keyof typeof summonsStatus;
};
