import { create } from "zustand";

interface ILoadingStore {
  loading: boolean;
  setLoading: (newLoading: boolean) => void;
}

const useLoadingStore = create<ILoadingStore>((set) => ({
  loading: false,
  setLoading: (newLoading) => set({ loading: newLoading }),
}));

export default useLoadingStore;
