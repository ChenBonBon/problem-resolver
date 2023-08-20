import { Checkbox, Flex, Link, Text } from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [loginType, setLoginType] = useState<"code" | "password">("code");

  const LoginForm = useMemo(() => {
    if (loginType === "code") {
      return <CodeForm />;
    } else if (loginType === "password") {
      return <PasswordForm />;
    }
  }, [loginType]);

  const Controls = useMemo(() => {
    if (loginType === "code") {
      return (
        <Link
          size="2"
          onClick={(e) => {
            e.preventDefault();
            setLoginType("password");
          }}
        >
          账号密码登录
        </Link>
      );
    } else if (loginType === "password") {
      return (
        <Flex justify="between">
          <Link
            size="2"
            onClick={(e) => {
              e.preventDefault();
              setLoginType("code");
            }}
          >
            验证码登录
          </Link>
          <Link
            size="2"
            onClick={(e) => {
              e.preventDefault();
              navigate("/forget-password");
            }}
          >
            忘记密码
          </Link>
        </Flex>
      );
    }
  }, [loginType]);

  return (
    <Flex justify="center" direction="column" align="center">
      <Wrapper>
        <Logo src={logo} alt={AppName} />
        <Flex direction="column" gap="5" pt="3">
          {LoginForm}
          {Controls}
          <Flex gap="3" align="center">
            <Checkbox
              checked={checked}
              onCheckedChange={(checked) => {
                setChecked(checked as boolean);
              }}
            />
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
