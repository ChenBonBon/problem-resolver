import { UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Layout as AntLayout, Menu as AntMenu } from "antd";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../components/Logo";
import { HeightFull } from "../constants";
import useAuth from "../hooks/useAuth";
import menus from "../menus";
import routes from "../routes";
import NotFound from "../routes/NotFound";

const Layout = styled(AntLayout)`
  ${HeightFull}
`;

const Header = styled(AntLayout.Header)`
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: white;
  padding: 0 8px;
`;

const HeaderStart = styled("div")`
  display: inline-flex;
  align-items: center;
  ${HeightFull}
`;

const HeaderCenter = styled(HeaderStart)`
  flex: auto;
`;

const Menu = styled(AntMenu)`
  flex: auto;
`;

const HeaderEnd = styled(HeaderStart)`
  text-align: right;
`;

const Content = styled(AntLayout.Content)`
  height: calc(100% - 64px - 48px);
`;

const Footer = styled(AntLayout.Footer)``;

const UserIcon = styled(UserOutlined)`
  cursor: pointer;
`;

function getHrefFromSelectedKey(selectedKey) {
  const selectedMenu = menus.find((menu) => menu.key === selectedKey);

  return selectedMenu?.href;
}

function getKeyFromCurrentPathname(pathname) {
  const currentMenu = menus.find((menu) => menu.href === pathname);

  return currentMenu?.key;
}

export default function BasicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [selectedKey, setSelectedKey] = useState("");

  const items = [
    {
      key: "logout",
      label: "登出",
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];

  const handleClick = (event) => {
    setSelectedKey(event.key);
    navigate(getHrefFromSelectedKey(event.key));
  };

  useEffect(() => {
    setSelectedKey(getKeyFromCurrentPathname(location.pathname));
  }, [location.pathname]);

  return (
    <Layout>
      <Header>
        <HeaderStart>
          <Logo />
        </HeaderStart>
        <HeaderCenter>
          <Menu
            onClick={handleClick}
            selectedKeys={[selectedKey]}
            mode="horizontal"
            items={menus}
          />
        </HeaderCenter>
        <HeaderEnd>
          {auth ? (
            <Dropdown menu={{ items }}>
              <UserIcon />
            </Dropdown>
          ) : (
            <Button type="primary">登陆 / 注册</Button>
          )}
        </HeaderEnd>
      </Header>
      <Content>
        <Routes>
          {routes.map((route) => (
            <Route key={route.key} path={route.path} element={route.element} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Content>
      <Footer></Footer>
    </Layout>
  );
}
