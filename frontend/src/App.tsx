import { Container, Flex } from "@radix-ui/themes";
import { Route, Routes } from "react-router-dom";
import { useTitle } from "react-use";
import styled from "styled-components";
import logo from "./assets/logo.svg";
import logoSmall from "./assets/logo_small.svg";
import Footer from "./components/Footer.tsx";
import Nav from "./components/Nav";
import Toast from "./components/Toast.tsx";
import { AppName, AppNameEn } from "./constants";
import useBreakpoint from "./hooks/useBreakpoint";
import useLogin from "./hooks/useLogin.ts";
import useToast from "./hooks/useToast.ts";
import menus, { avatarMenus } from "./menus";
import routes from "./routes";

const Wrapper = styled(Flex)`
  max-width: 1280px;
  padding: 0 24px;
  height: 100vh;
`;

const Content = styled(Container)`
  padding-bottom: 56px;
`;

function App() {
  useTitle(`${AppNameEn} - ${AppName}`);

  const { isSmallScreen } = useBreakpoint();
  const { type, visible, description, setVisible } = useToast();
  const { isLogin } = useLogin();

  return (
    <Wrapper direction="column" justify="between">
      <Nav
        logo={{
          src: isSmallScreen ? logoSmall : logo,
          alt: AppName,
        }}
        menus={menus}
        avatar={
          isLogin
            ? {
                img: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop",
                username: "BonBon",
                menus: avatarMenus,
              }
            : undefined
        }
      />
      <Content style={{ background: "var(--gray-a2)" }}>
        <Routes>
          {routes.map((route) => (
            <Route key={route.key} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Content>
      {visible && (
        <Toast type={type} description={description} setVisible={setVisible} />
      )}
      <Footer />
    </Wrapper>
  );
}

export default App;
