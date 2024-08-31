import { create } from "zustand";

export type WelcomeViewState = "initial" | "new" | "open" | undefined;

type StoreState = {
  welcomeView: WelcomeViewState;
  mountDirection: "left" | "right";
  showSettings: boolean;
};

type StoreActions = {
  setWelcomeView: (state: WelcomeViewState) => void;
  setMountDirection: (direction: "left" | "right") => void;
  setShowSettings: (show: boolean) => void;
};

export const useStore = create<StoreState & StoreActions>()((set) => ({
  welcomeView: undefined,
  mountDirection: "right",
  showSettings: true,
  setWelcomeView: (state) => set({ welcomeView: state }),
  setMountDirection: (direction) => set({ mountDirection: direction }),
  setShowSettings: (show: boolean) => set({ showSettings: show }),
}));
