import { TextArea } from "@radix-ui/themes";
import useBreakpoint from "../../hooks/useBreakpoint";

interface IEditor {
  value: string;
  onChange: (value: string) => void;
}

export default function Editor(props: IEditor) {
  const { isSmallScreen } = useBreakpoint();

  return (
    <TextArea
      placeholder="请输入您的答案"
      size={isSmallScreen ? "1" : "2"}
      value={props.value}
      onChange={(e) => {
        props.onChange(e.target.value);
      }}
    />
  );
}
