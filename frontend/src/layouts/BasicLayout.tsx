import { UserOutlined } from "@ant-design/icons";
import { Layout as AntLayout, Menu as AntMenu, Button, Dropdown } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../components/Logo";
import { HeightFull } from "../constants";
import useAuth from "../hooks/useAuth";
import menus from "../menus";

const Layout = styled(AntLayout)`
  ${HeightFull}
`;

const Header = styled(AntLayout.Header)`
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: white;
  padding: 0 16px;
  box-shadow: 0 0 0 1px #eeeeee;
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
  border: none;
`;

const HeaderEnd = styled(HeaderStart)`
  text-align: right;
`;

const Content = styled(AntLayout.Content)`
  height: calc(100% - 64px - 48px);
  background-color: #ffffff;
`;

const Footer = styled(AntLayout.Footer)`
  text-align: center;
  background-color: #ffffff;
`;

const UserIcon = styled(UserOutlined)`
  cursor: pointer;
`;

export default function BasicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const auth = useAuth();
  const [selectedKey, setSelectedKey] = useState("");

  const items = [
    {
      key: "problem-type",
      label: "问题分类管理",
      onClick: () => {
        navigate("/admin/problem-type");
      },
    },
    {
      key: "problem",
      label: "问题管理",
      onClick: () => {
        navigate("/admin/problem");
      },
    },
    {
      key: "logout",
      label: "登出",
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];

  useEffect(() => {
    dispatch.user.getUser();
  }, []);

  useEffect(() => {
    setSelectedKey(location.pathname.substring(1));
  }, [location.pathname]);

  return (
    <Layout>
      <Header>
        <HeaderStart>
          <Logo />
        </HeaderStart>
        <HeaderCenter>
          <Menu
            onClick={({ key }) => {
              setSelectedKey(key);
              navigate(`/${key}`);
            }}
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
            <Button
              type="primary"
              onClick={() => {
                navigate("/login");
              }}
            >
              登陆 / 注册
            </Button>
          )}
        </HeaderEnd>
      </Header>
      <Content>
        <Outlet />
      </Content>
      <Footer>
        <a href="https://beian.miit.gov.cn/" target="_blank">
          苏ICP备17066944号-1
        </a>
      </Footer>
    </Layout>
  );
}
