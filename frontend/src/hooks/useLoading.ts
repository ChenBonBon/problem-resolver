import useLoadingStore from "../stores/loading";

export default function useLoading() {
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);

  return {
    isLoading,
    setIsLoading,
  };
}
