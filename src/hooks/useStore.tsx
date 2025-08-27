import { CaseType } from "@/types/data/case";
import { Listing } from "@/types/data/listing";
import { create } from "zustand";

export type WelcomeViewState = "initial" | "new" | "open" | undefined;

type StoreState = {
  welcomeView: WelcomeViewState;
  mountDirection: "left" | "right";
  showSettings: boolean;
  currentListing: Listing | null;
  sharedCaseTypes: false | CaseType | "empty";
};

type StoreActions = {
  setWelcomeView: (state: WelcomeViewState) => void;
  setMountDirection: (direction: "left" | "right") => void;
  setShowSettings: (show: boolean) => void;
  setCurrentListing: (value: Listing | null) => void;
};

export const useStore = create<StoreState & StoreActions>()((set) => ({
  welcomeView: undefined,
  mountDirection: "right",
  showSettings: true,
  currentListing: null,
  sharedCaseTypes: false,
  setWelcomeView: (state) => set({ welcomeView: state }),
  setMountDirection: (direction) => set({ mountDirection: direction }),
  setShowSettings: (show: boolean) => set({ showSettings: show }),
  setCurrentListing: (value) => {
    const sharedTypes = getHaveSharedCaseTypes(value);
    set({ currentListing: value, sharedCaseTypes: sharedTypes });
  },
}));

const getHaveSharedCaseTypes = (value: Listing | null) => {
  if (!value || value.cases.length === 0) {
    return "empty";
  }

  const firstType = value.cases[0].type;

  for (let c of value.cases) {
    if (c.type !== firstType) {
      return false;
    }
  }

  return firstType;
};
