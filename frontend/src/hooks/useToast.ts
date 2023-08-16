import useToastStore from "../stores/toast";

export default function useToast() {
  const visible = useToastStore((state) => state.visible);
  const description = useToastStore((state) => state.description);
  const setVisible = useToastStore((state) => state.setVisible);
  const setDescription = useToastStore((state) => state.setDescription);

  return { visible, description, setVisible, setDescription };
}
