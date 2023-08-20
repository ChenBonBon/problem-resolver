import { Text } from "@radix-ui/themes";
import { ReactNode } from "react";

interface IErrorText {
  children?: ReactNode;
}

export default function ErrorText(props: IErrorText) {
  return (
    <Text color="red" size="2">
      {props.children}
    </Text>
  );
}
