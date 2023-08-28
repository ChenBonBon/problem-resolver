import { Checkbox, Flex, Link, Text } from "@radix-ui/themes";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { useEffectOnce } from "react-use";

import LoginLayout from "../../layouts/LoginLayout";
import useLoginStore from "../../stores/login";
import CodeForm from "./CodeForm";
import ForgetPasswordForm from "./ForgetPasswordForm";
import PasswordForm from "./PasswordForm";

export default function Login() {
  const checked = useLoginStore((state) => state.checked);
  const setChecked = useLoginStore((state) => state.setChecked);
  const setSended = useLoginStore((state) => state.setSended);
  const [loginType, setLoginType] = useState<"code" | "password" | "forget">(
    "code"
  );

  const LoginForm = useMemo(() => {
    if (loginType === "code") {
      return <CodeForm />;
    } else if (loginType === "password") {
      return <PasswordForm />;
    } else if (loginType === "forget") {
      return <ForgetPasswordForm />;
    }
  }, [loginType]);

  const changeLoginType = useCallback(
    (
      e: MouseEvent<HTMLAnchorElement>,
      type: "code" | "password" | "forget"
    ) => {
      e.preventDefault();
      setLoginType(type);
    },
    []
  );

  const passwordLogin = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      changeLoginType(e, "password");
    },
    [changeLoginType]
  );

  const codeLogin = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      changeLoginType(e, "code");
    },
    [changeLoginType]
  );

  const forgetPassword = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      changeLoginType(e, "forget");
    },
    [changeLoginType]
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
    <LoginLayout>
      {LoginForm}
      {Controls}
      {loginType !== "forget" && (
        <Flex gap="3" align="center">
          <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
          <Text size="1">
            注册或登录即代表您同意<Link>《用户协议》</Link>和
            <Link>《隐私政策》</Link>
          </Text>
        </Flex>
      )}
    </LoginLayout>
  );
}
