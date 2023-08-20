import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";
import { ReactNode, useEffect } from "react";
import { styled } from "styled-components";
import useCountdown from "../hooks/useCountdown";
import { IToastType } from "../stores/toast";

interface IToast {
  type?: "success" | "error" | "warning" | "info";
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
  z-index: 9;
`;

const typeMap: { [key in IToastType]: Color } = {
  success: "green",
  warning: "yellow",
  info: "blue",
  error: "red",
};

export default function Toast(props: IToast) {
  const remaining = useCountdown(props.duration ?? 3);

  useEffect(() => {
    if (remaining <= 0) {
      if (props.setVisible) {
        props.setVisible(false);
      }
    }
  }, [remaining]);

  return (
    <Wrapper>
      <Callout.Root color={typeMap[props.type ?? "info"]} role="alert">
        <Callout.Icon>
          <ExclamationTriangleIcon />
        </Callout.Icon>
        <Callout.Text>{props.description}</Callout.Text>
      </Callout.Root>
    </Wrapper>
  );
}
