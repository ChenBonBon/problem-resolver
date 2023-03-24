import { Layout as AntLayout } from "antd";
import styled from "styled-components";
import Logo from "../components/Logo";
import { HeightFull } from "../constants";
import Login from "../routes/Login";

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

const HeaderEnd = styled(HeaderStart)`
  text-align: right;
`;

const Content = styled(AntLayout.Content)`
  height: calc(100% - 64px - 48px);
`;

export default function GuestLayout() {
  return (
    <Layout>
      <Header>
        <HeaderStart>
          <Logo />
        </HeaderStart>
      </Header>
      <Content>
        <Login />
      </Content>
    </Layout>
  );
}
