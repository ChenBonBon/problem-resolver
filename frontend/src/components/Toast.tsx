import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";
import { ReactNode } from "react";
import { styled } from "styled-components";
import useCountdown from "../hooks/useCountdown";

interface IToast {
  visible?: boolean;
  setVisible?: (newVisible: boolean) => void;
  duration?: number;
  description?: ReactNode;
}

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  background-color: white;
  display: flex;
  flex-direction: column;
`;

export default function Toast(props: IToast) {
  const remaining = useCountdown(props.duration ?? 3);

  if (!props.visible || remaining <= 0) {
    return null;
  }

  return (
    <Wrapper>
      <Callout.Root color="red" role="alert">
        <Callout.Icon>
          <ExclamationTriangleIcon />
        </Callout.Icon>
        <Callout.Text>{props.description}</Callout.Text>
      </Callout.Root>
    </Wrapper>
  );
}
