import { Flex, Tabs } from "@radix-ui/themes";
import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IMenu } from "../menus";
import Avatar, { IAvatar } from "./Avatar";
import Button from "./Button";
import LinkText from "./LinkText";
import Logo, { ILogo } from "./Logo";

interface INav {
  logo?: ILogo;
  menus?: IMenu[];
  avatar?: IAvatar;
}

const Wrapper = styled.nav`
  padding: 16px 0;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
`;

const TabsRoot = styled(Tabs.Root)`
  flex: 1;
`;

const TabsList = styled(Tabs.List)`
  box-shadow: none;
`;

export default function Nav(props: INav) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const menuLink = useMemo(() => {
    return pathname.substring(
      0,
      pathname.lastIndexOf("/") > 0
        ? pathname.lastIndexOf("/")
        : pathname.length
    );
  }, [pathname]);

  const link = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { key } = e.currentTarget.dataset;
      const menu = props.menus?.find((menu) => menu.key === key);
      if (menu?.link) {
        navigate(menu.link);
      }
    },
    [navigate, props.menus]
  );

  const login = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <Wrapper>
      <Flex gap="5" align="center">
        {props.logo && <Logo {...props.logo} />}
        {props.menus && (
          <TabsRoot defaultValue={menuLink}>
            <TabsList size="2">
              {props.menus.map((menu) => (
                <Tabs.Trigger key={menu.key} value={menu.link ?? ""}>
                  <LinkText data-key={menu.key} onClick={link}>
                    {menu.label}
                  </LinkText>
                </Tabs.Trigger>
              ))}
            </TabsList>
          </TabsRoot>
        )}
        {props.avatar ? (
          <Avatar {...props.avatar} />
        ) : (
          <Button onClick={login}>登陆</Button>
        )}
      </Flex>
    </Wrapper>
  );
}
