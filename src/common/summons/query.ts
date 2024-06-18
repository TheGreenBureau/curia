import fiDefendantSummons from "@locales/fi/defendantSummonsTypes.json";
import svDefendantSummons from "@locales/sv/defendantSummonsTypes.json";
import fiGenericSummons from "@locales/fi/genericSummonsTypes.json";
import svGenericSummons from "@locales/sv/genericSummonsTypes.json";
import fiStatus from "@locales/fi/summonsStatus.json";
import svStatus from "@locales/sv/summonsStatus.json";
import { DropdownOption } from "@purplebureau/sy-react/dist/@types/Dropdown";
import { getAsArray, getAsOptions } from "@common/dataUtils";

type SummonsFetchType = "defendant" | "generic" | "status";

export const getSummons = (type: SummonsFetchType, lang: string): string[] => {
  switch (type) {
    case "defendant":
      return getAsArray(fiDefendantSummons, svDefendantSummons, lang);
    case "generic":
      return getAsArray(fiGenericSummons, svGenericSummons, lang);
    default:
      return getAsArray(fiStatus, svStatus, lang);
  }
};

export const getSummonsAsOptions = (
  type: SummonsFetchType,
  lang: string
): DropdownOption[] => {
  switch (type) {
    case "defendant":
      return getAsOptions(fiDefendantSummons, svDefendantSummons, lang);
    case "generic":
      return getAsOptions(fiGenericSummons, svGenericSummons, lang);
    default:
      return getAsOptions(fiStatus, svStatus, lang);
  }
};
