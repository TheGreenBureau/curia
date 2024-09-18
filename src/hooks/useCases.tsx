import { useMutateCurrentListing } from "@/hooks/mutations";
import { useEffect, useState } from "react";
import { Case } from "@/types/data/case";
import { produce } from "immer";
import { Listing } from "@/types/data/listing";
import { UseQueryResult } from "@tanstack/react-query";
import { useStore } from "@/hooks/useStore";

export const useCases = () => {
  const [cases, setCases] = useState<Case[]>([]);

  const listing = useStore((state) => state.currentListing);

  useEffect(() => {
    setCases(listing ? listing.cases : []);
  }, [listing]);

  const updateListing = useMutateCurrentListing();

  const updateCases = (cases: Case[]) => {
    if (!listing) {
      return;
    }

    setCases(cases);
    updateListing.mutate(
      produce(listing, (draft) => {
        draft.cases = cases;
      })
    );
  };

  return [cases, updateCases, listing] as const;
};

export type UseCaseValues = {
  currentCase: Case;
  updateCase: (updated: Case) => void;
  saveCase: (updated?: Case) => void;
  currentListing: Listing | null;
};

export const useCase = (item: Case): UseCaseValues => {
  const [currentCase, setCurrentCase] = useState<Case>({
    ...item,
    time: new Date(item.time),
  });

  const currentListing = useStore((state) => state.currentListing);
  const updateListing = useMutateCurrentListing();

  useEffect(() => {
    if (currentListing) {
      const foundCase = currentListing.cases.find(
        (c) => c.id === currentCase.id
      );

      if (foundCase) {
        setCurrentCase({
          ...foundCase,
          time: new Date(foundCase.time),
        });
      }
    }
  }, [currentListing]);

  const updateCase = (updated: Case) => {
    setCurrentCase(updated);
  };

  const saveCase = (updated?: Case) => {
    if (updated) {
      setCurrentCase(updated);
    }

    if (!currentListing) {
      return;
    }

    updateListing.mutate(
      produce(currentListing, (draft) => {
        const currentCaseIndex = draft.cases.findIndex((c) => c.id === item.id);

        if (currentCaseIndex === -1) {
          draft.cases.push(updated ?? currentCase);
        }

        draft.cases[currentCaseIndex] = updated ?? currentCase;
      })
    );
  };

  return {
    currentCase,
    updateCase,
    saveCase,
    currentListing,
  };
};
