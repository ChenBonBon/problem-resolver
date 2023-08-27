import { Container, Flex } from "@radix-ui/themes";
import { Route, Routes } from "react-router-dom";
import { useEffectOnce, useTitle } from "react-use";
import styled from "styled-components";
import logo from "./assets/logo.svg";
import logoSmall from "./assets/logo_small.svg";
import Footer from "./components/Footer.tsx";
import Loading from "./components/Loading.tsx";
import Nav from "./components/Nav";
import Toast from "./components/Toast.tsx";
import { AppName, AppNameEn } from "./constants";
import useBreakpoint from "./hooks/useBreakpoint";
import useLoading from "./hooks/useLoading.ts";
import useLogin from "./hooks/useLogin.ts";
import useToast from "./hooks/useToast.ts";
import menus, { avatarMenus } from "./menus";
import routes from "./routes";

const Wrapper = styled(Flex)`
  position: relative;
  max-width: 1600px;
  padding: 0 24px;
  margin: 0 auto;
  height: 100vh;
`;

const Content = styled(Container)`
  padding-bottom: 56px;
`;

const LoadingWrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(204, 204, 204, 0.5);
  pointer-events: none;
  z-index: 10;
  text-align: center;
  padding-top: 35%;
`;

function App() {
  useTitle(`${AppName} - ${AppNameEn}`);

  const { smallScreen } = useBreakpoint();
  const { loading } = useLoading();
  const { type, visible, description, setVisible } = useToast();
  const { logined, username, getUser } = useLogin();

  useEffectOnce(() => {
    getUser();
  });

  return (
    <Wrapper direction="column" justify="between">
      <Nav
        logo={{
          src: smallScreen ? logoSmall : logo,
          alt: AppName,
        }}
        menus={menus}
        avatar={
          logined
            ? {
                img: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop",
                username,
                menus: avatarMenus,
              }
            : undefined
        }
      />
      <Content style={{ background: "var(--gray-a2)" }} px="5" py="3">
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
      {loading && (
        <LoadingWrapper>
          <Loading visible={true}>Loading...</Loading>
        </LoadingWrapper>
      )}
    </Wrapper>
  );
}

export default App;
