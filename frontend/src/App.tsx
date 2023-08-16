import { Container } from "@radix-ui/themes";
import { Route, Routes } from "react-router-dom";
import { useTitle } from "react-use";
import styled from "styled-components";
import logo from "./assets/logo.svg";
import logoSmall from "./assets/logo_small.svg";
import Nav from "./components/Nav";
import Toast from "./components/Toast.tsx";
import { AppName, AppNameEn } from "./constants";
import useBreakpoint from "./hooks/useBreakpoint";
import useToast from "./hooks/useToast.ts";
import menus from "./menus";
import routes from "./routes";

const Wrapper = styled(Container)`
  max-width: 1280px;
  padding: 0 24px;
`;

function App() {
  useTitle(`${AppNameEn} - ${AppName}`);

  const { isSmallScreen } = useBreakpoint();
  const { visible, description, setVisible } = useToast();

  return (
    <Wrapper>
      <Nav
        logo={{
          src: isSmallScreen ? logoSmall : logo,
          alt: AppName,
        }}
        menus={menus}
      />
      <Container>
        <Routes>
          {routes.map((route) => (
            <Route key={route.key} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Container>
      <Toast
        visible={visible}
        description={description}
        setVisible={setVisible}
      />
    </Wrapper>
  );
}

export default App;
