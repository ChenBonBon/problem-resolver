import styled from "styled-components";
import LoginForm from "../components/LoginForm";

const LoginWrapper = styled("div")`
  margin: 24px 20%;
`;

export default function Login() {
  return (
    <LoginWrapper>
      <LoginForm />
    </LoginWrapper>
  );
}
