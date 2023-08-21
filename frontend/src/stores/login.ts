import { create } from "zustand";

interface ILoginStore {
  checked: boolean;
  setChecked: (newChecked: boolean) => void;
}

const useLoginStore = create<ILoginStore>((set) => ({
  checked: window.localStorage.getItem("agreeLicense") ? true : false,
  setChecked: (newChecked) => set({ checked: newChecked }),
}));

export default useLoginStore;
