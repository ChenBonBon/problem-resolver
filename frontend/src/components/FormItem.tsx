import { Flex } from "@radix-ui/themes";
import { ReactNode } from "react";
import { styled } from "styled-components";
import ErrorText from "./ErrorText";

interface IFormItem {
  label?: ReactNode;
  children?: ReactNode;
  required?: boolean;
  errorText?: string;
  status?: "error" | "success";
}

const Label = styled.label<{ required?: boolean }>`
  font-size: 16px;
  font-weight: 500;

  &::after {
    content: "*";
    color: var(--accent-a11);
    padding-left: 4px;
    vertical-align: middle;
    display: ${({ required }) => (required ? "inline-block" : "none")};
  }
`;

export default function FormItem(props: IFormItem) {
  return (
    <Flex direction="column" gap="3">
      {props.label && (
        <Label data-accent-color="red" required={props.required}>
          {props.label}
        </Label>
      )}
      {props.children}
      {props.status === "error" && <ErrorText>{props.errorText}</ErrorText>}
    </Flex>
  );
}
