import { useDefaults } from "@/hooks/queries";
import { Case } from "@/types/data/case";

export const useCreateNewCase = () => {
  const defaults = useDefaults();

  const create = (): Case => {
    const date = new Date();
    date.setHours(9, 0, 0);

    return {
      id: "",
      caseNumber: "",
      prosecutorCaseNumber: "",
      matter: "",
      time: date,
      type: "criminal",
      officers: [],
      civilians: [],
    };
  };

  return create;
};
