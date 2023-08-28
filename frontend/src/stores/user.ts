import { create } from "zustand";

interface IUserStore {
  username: string;
  setUsername: (newUsername: string) => void;
}

const useUserStore = create<IUserStore>((set) => ({
  username: "",

  setUsername: (newUsername) => set({ username: newUsername }),
}));

export default useUserStore;
