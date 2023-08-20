import { ReactNode } from "react";
import { create } from "zustand";

export type IToastType = "success" | "error" | "warning" | "info";

interface IToastStore {
  type: IToastType;
  visible: boolean;
  description: ReactNode;
  setType: (newType: IToastType) => void;
  setVisible: (newVisible: boolean) => void;
  setDescription: (newDescription: ReactNode) => void;
}

const useToastStore = create<IToastStore>((set) => ({
  type: "info",
  visible: false,
  description: null,
  setType: (newType) => set({ type: newType }),
  setVisible: (newVisible) => set({ visible: newVisible }),
  setDescription: (newDescription) => set({ description: newDescription }),
}));

export default useToastStore;
