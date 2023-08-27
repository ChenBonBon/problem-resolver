import { create } from "zustand";

interface ILoginStore {
  checked: boolean;
  sended: boolean;
  logined: boolean;
  username: string;
  setChecked: (newChecked: boolean) => void;
  setSended: (newSended: boolean) => void;
  setLogined: (newLogined: boolean) => void;
  setUsername: (newUsername: string) => void;
}

const useLoginStore = create<ILoginStore>((set) => ({
  checked: window.localStorage.getItem("agreeLicense") ? true : false,
  sended: false,
  logined: window.localStorage.getItem("token") ? true : false,
  username: "",

  setChecked: (newChecked) => set({ checked: newChecked }),
  setSended: (newSended) => set({ sended: newSended }),
  setLogined: (newLogined) => set({ logined: newLogined }),
  setUsername: (newUsername) => set({ username: newUsername }),
}));

export default useLoginStore;
