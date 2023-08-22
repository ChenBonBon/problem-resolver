import useLoadingStore from "../stores/loading";

export default function useLoading() {
  const loading = useLoadingStore((state) => state.loading);
  const setLoading = useLoadingStore((state) => state.setLoading);

  return {
    loading,
    setLoading,
  };
}
