import { create } from "zustand";
import { Modal } from "app/modals";

type StoreState = {
  modal: Modal | null;
  modalOpen: boolean;
};

type StoreActions = {
  setModal: (modal: Modal) => void;
  showModal: () => void;
  closeModal: () => void;
};

export const useStore = create<StoreState & StoreActions>()((set) => ({
  modal: null,
  modalOpen: false,
  setModal: (modal) => set({ modal: modal }),
  showModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
}));
