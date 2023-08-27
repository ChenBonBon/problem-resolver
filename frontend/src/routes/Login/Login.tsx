import { Checkbox, Flex, Link, Text } from "@radix-ui/themes";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffectOnce } from "react-use";
import { styled } from "styled-components";
import logo from "../../assets/logo.svg";
import Logo from "../../components/Logo";
import { AppName } from "../../constants";
import useLoginStore from "../../stores/login";
import CodeForm from "./CodeForm";
import PasswordForm from "./PasswordForm";

const Wrapper = styled.div`
  margin-top: 15vh;
  background-color: white;
  padding: 24px 32px;
  width: 350px;
`;

export default function Login() {
  const navigate = useNavigate();
  const checked = useLoginStore((state) => state.checked);
  const setChecked = useLoginStore((state) => state.setChecked);
  const setSended = useLoginStore((state) => state.setSended);
  const [loginType, setLoginType] = useState<"code" | "password">("code");

  const LoginForm = useMemo(() => {
    if (loginType === "code") {
      return <CodeForm />;
    } else if (loginType === "password") {
      return <PasswordForm />;
    }
  }, [loginType]);

  const passwordLogin = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setLoginType("password");
  }, []);

  const codeLogin = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setLoginType("code");
  }, []);

  const forgetPassword = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      navigate("/forget-password");
    },
    [navigate]
  );

  const Controls = useMemo(() => {
    if (loginType === "code") {
      return (
        <Link size="2" onClick={passwordLogin}>
          账号密码登录
        </Link>
      );
    } else if (loginType === "password") {
      return (
        <Flex justify="between">
          <Link size="2" onClick={codeLogin}>
            验证码登录
          </Link>
          <Link size="2" onClick={forgetPassword}>
            忘记密码
          </Link>
        </Flex>
      );
    }
  }, [codeLogin, forgetPassword, loginType, passwordLogin]);

  const onCheckedChange = useCallback(
    (checked: CheckedState) => {
      setChecked(checked as boolean);
      if (checked) {
        window.localStorage.setItem("agreeLicense", "true");
      } else {
        window.localStorage.removeItem("agreeLicense");
      }
    },
    [setChecked]
  );

  useEffectOnce(() => {
    setSended(false);
  });

  return (
    <Flex justify="center" direction="column" align="center">
      <Wrapper>
        <Logo src={logo} alt={AppName} />
        <Flex direction="column" gap="5" pt="3">
          {LoginForm}
          {Controls}
          <Flex gap="3" align="center">
            <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
            <Text size="1">
              注册或登录即代表您同意<Link>《用户协议》</Link>和
              <Link>《隐私政策》</Link>
            </Text>
          </Flex>
        </Flex>
      </Wrapper>
    </Flex>
  );
}
