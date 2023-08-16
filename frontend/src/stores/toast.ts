import { ReactNode } from "react";
import { create } from "zustand";

interface IToastStore {
  visible: boolean;
  description: ReactNode;
  setVisible: (newVisible: boolean) => void;
  setDescription: (newDescription: ReactNode) => void;
}

const useToastStore = create<IToastStore>((set) => ({
  visible: false,
  description: null,
  setVisible: (newVisible) => set({ visible: newVisible }),
  setDescription: (newDescription) => set({ description: newDescription }),
}));

export default useToastStore;
