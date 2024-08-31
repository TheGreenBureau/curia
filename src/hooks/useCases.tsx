import { useCurrentListing } from "@/hooks/queries";
import { useMutateCurrentListing } from "@/hooks/mutations";
import { useEffect, useState } from "react";
import { Case } from "@/types/data/case";
import { produce } from "immer";

export const useCases = () => {
  const [cases, setCases] = useState<Case[]>([]);

  const listing = useCurrentListing((previous) =>
    produce(previous, (draft) => {
      draft.cases = cases;
    })
  );

  useEffect(() => {
    if (listing.isSuccess) {
      setCases(listing.data.cases);
    }
  }, [listing.data]);

  const updateListing = useMutateCurrentListing();

  const updateCases = (cases: Case[]) => {
    setCases(cases);
    updateListing.mutate(
      produce(listing.data, (draft) => {
        draft.cases = cases;
      })
    );
  };

  return [cases, updateCases, listing] as const;
};

export const useCase = (item: Case) => {
  const [currentCase, setCurrentCase] = useState<Case | null>({
    ...item,
    time: new Date(item.time),
  });

  const listing = useCurrentListing();
  const updateListing = useMutateCurrentListing();

  useEffect(() => {
    if (listing.isSuccess) {
      const foundCase = listing.data.cases.find((c) => c.id === currentCase.id);

      if (foundCase) {
        setCurrentCase({
          ...foundCase,
          time: new Date(foundCase.time),
        });
      }
    }
  }, [listing.data]);

  const updateCase = (updated: Case) => {
    setCurrentCase(updated);
  };

  const saveCase = (updated?: Case) => {
    if (updated) {
      setCurrentCase(updated);
    }

    updateListing.mutate(
      produce(listing.data, (draft) => {
        const currentCaseIndex = draft.cases.findIndex((c) => c.id === item.id);

        if (currentCaseIndex === -1) {
          draft.cases.push(updated ?? currentCase);
        }

        draft.cases[currentCaseIndex] = updated ?? currentCase;
      })
    );
  };

  return [currentCase, updateCase, saveCase, listing] as const;
};
