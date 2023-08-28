import { Flex } from "@radix-ui/themes";
import { ReactNode } from "react";
import { styled } from "styled-components";
import logo from "../assets/logo.svg";
import Logo from "../components/Logo";
import { AppName } from "../constants";

interface ILoginLayout {
  children?: ReactNode;
}

const Wrapper = styled.div`
  margin-top: 15vh;
  background-color: white;
  padding: 24px 32px;
  width: 350px;
`;

export default function LoginLayout(props: ILoginLayout) {
  return (
    <Flex justify="center" direction="column" align="center">
      <Wrapper>
        <Logo src={logo} alt={AppName} />
        <Flex direction="column" gap="5" pt="3">
          {props.children}
        </Flex>
      </Wrapper>
    </Flex>
  );
}
