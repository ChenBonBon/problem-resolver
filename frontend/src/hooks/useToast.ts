import useToastStore, { IToastType } from "../stores/toast";

export default function useToast() {
  const type = useToastStore((state) => state.type);
  const visible = useToastStore((state) => state.visible);
  const description = useToastStore((state) => state.description);
  const setType = useToastStore((state) => state.setType);
  const setVisible = useToastStore((state) => state.setVisible);
  const setDescription = useToastStore((state) => state.setDescription);

  function showToast(type: IToastType, description: string) {
    setType(type);
    setVisible(true);
    setDescription(description);
  }

  return {
    type,
    visible,
    description,
    showToast,
    setType,
    setVisible,
    setDescription,
  };
}
