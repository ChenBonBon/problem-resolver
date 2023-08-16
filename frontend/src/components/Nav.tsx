import { Flex, Grid } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useBreakpoint from "../hooks/useBreakpoint";
import { IMenu } from "../menus";
import StyledButton from "./Button";
import Logo, { ILogo } from "./Logo";

interface INav {
  logo?: ILogo;
  menus?: IMenu[];
}

const Wrapper = styled.nav`
  padding: 16px 0;
`;

export default function Nav(props: INav) {
  const navigate = useNavigate();
  const { isSmallScreen } = useBreakpoint();

  return (
    <Wrapper>
      <Flex gap="5" align="center">
        {props.logo && <Logo {...props.logo} />}
        {props.menus && (
          <Grid columns={props.menus.length.toString()} gap="5" width="auto">
            {props.menus.map((menu) => (
              <StyledButton
                key={menu.key}
                variant="ghost"
                size={isSmallScreen ? "3" : "4"}
                onClick={() => {
                  if (menu.link) {
                    navigate(menu.link);
                  }
                }}
              >
                {menu.label}
              </StyledButton>
            ))}
          </Grid>
        )}
      </Flex>
    </Wrapper>
  );
}
