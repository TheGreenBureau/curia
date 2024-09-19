import { Listing } from "@/types/data/listing";
import { create } from "zustand";

export type WelcomeViewState = "initial" | "new" | "open" | undefined;

type StoreState = {
  welcomeView: WelcomeViewState;
  mountDirection: "left" | "right";
  showSettings: boolean;
  currentListing: Listing | null;
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
  setWelcomeView: (state) => set({ welcomeView: state }),
  setMountDirection: (direction) => set({ mountDirection: direction }),
  setShowSettings: (show: boolean) => set({ showSettings: show }),
  setCurrentListing: (value) => set({ currentListing: value }),
}));
