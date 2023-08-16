import { create } from "zustand";

interface ILoadingStore {
  isLoading: boolean;
  setIsLoading: (newIsLoading: boolean) => void;
}

const useLoadingStore = create<ILoadingStore>((set) => ({
  isLoading: false,
  setIsLoading: (newIsLoading) => set({ isLoading: newIsLoading }),
}));

export default useLoadingStore;
