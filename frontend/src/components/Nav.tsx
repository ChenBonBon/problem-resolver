import { Flex, Tabs } from "@radix-ui/themes";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IMenu } from "../menus";
import LinkText from "./LinkText";
import Logo, { ILogo } from "./Logo";

interface INav {
  logo?: ILogo;
  menus?: IMenu[];
}

const Wrapper = styled.nav`
  padding: 16px 0;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
`;

export default function Nav(props: INav) {
  const navigate = useNavigate();
  let { pathname } = useLocation();

  const menuLink = useMemo(() => {
    return pathname.substring(
      0,
      pathname.lastIndexOf("/") > 0
        ? pathname.lastIndexOf("/")
        : pathname.length
    );
  }, []);

  return (
    <Wrapper>
      <Flex gap="5" align="center">
        {props.logo && <Logo {...props.logo} />}
        {props.menus && (
          <Tabs.Root defaultValue={menuLink}>
            <Tabs.List size="2">
              {props.menus.map((menu) => (
                <Tabs.Trigger key={menu.key} value={menu.link ?? ""}>
                  <LinkText
                    onClick={() => {
                      if (menu.link) {
                        navigate(menu.link);
                      }
                    }}
                  >
                    {menu.label}
                  </LinkText>
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>
        )}
      </Flex>
    </Wrapper>
  );
}
