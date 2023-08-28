import { create } from "zustand";

interface ILoginStore {
  checked: boolean;
  sended: boolean;
  logined: boolean;
  setChecked: (newChecked: boolean) => void;
  setSended: (newSended: boolean) => void;
  setLogined: (newLogined: boolean) => void;
}

const useLoginStore = create<ILoginStore>((set) => ({
  checked: window.localStorage.getItem("agreeLicense") ? true : false,
  sended: false,
  logined: window.localStorage.getItem("token") ? true : false,

  setChecked: (newChecked) => set({ checked: newChecked }),
  setSended: (newSended) => set({ sended: newSended }),
  setLogined: (newLogined) => set({ logined: newLogined }),
}));

export default useLoginStore;
