import { Box, Flex, TextField } from "@radix-ui/themes";
import { ChangeEvent, useCallback, useState } from "react";
import { useToggle } from "react-use";
import Button from "../../components/Button";
import FormItem from "../../components/FormItem";
import useCountdown from "../../hooks/useCountdown";
import useLogin from "../../hooks/useLogin";
import useRedirect from "../../hooks/useRedirect";

export default function CodeForm() {
  const [form, setForm] = useState({
    email: "",
    code: "",
  });

  const [emailError, toggleEmailError] = useToggle(false);
  const [codeError, toggleCodeError] = useToggle(false);

  const { remaining, start, restart } = useCountdown(60);

  const { sended, loginWithCode, getCode } = useLogin();
  const redirect = useRedirect();

  const emailOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setForm({
        ...form,
        email: e.target.value,
      });
    },
    [form]
  );

  const codeOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setForm({
        ...form,
        code: e.target.value,
      });
    },
    [form]
  );

  const getCodeOnClick = useCallback(() => {
    if (sended && remaining > 0) {
      return;
    }

    if (form.email.length === 0) {
      toggleEmailError(true);
      return;
    } else {
      toggleEmailError(false);
    }

    if (sended) {
      restart();
    } else {
      start();
    }

    getCode(form.email);
  }, [
    form.email,
    getCode,
    remaining,
    restart,
    sended,
    start,
    toggleEmailError,
  ]);

  const login = useCallback(async () => {
    if (form.email.length === 0) {
      toggleEmailError(true);
      return;
    } else {
      toggleEmailError(false);
    }

    if (form.code.length === 0) {
      toggleCodeError(true);
      return;
    } else {
      toggleCodeError(false);
    }

    await loginWithCode(form.email, form.code);
    redirect();
  }, [
    form.code,
    form.email,
    loginWithCode,
    redirect,
    toggleCodeError,
    toggleEmailError,
  ]);

  return (
    <>
      <FormItem
        required
        errorText="请输入邮箱"
        status={emailError ? "error" : "success"}
      >
        <TextField.Input
          placeholder="输入邮箱"
          onChange={emailOnChange}
          readOnly={sended}
        />
      </FormItem>
      <div>
        <Flex gap="3">
          <Box width="100%">
            <FormItem
              required
              errorText="请输入验证码"
              status={codeError ? "error" : "success"}
            >
              <TextField.Input placeholder="验证码" onChange={codeOnChange} />
            </FormItem>
          </Box>
          <Button onClick={getCodeOnClick} disabled={form.email.length === 0}>
            {sended && remaining > 0 ? `${remaining}秒` : "获取验证码"}
          </Button>
        </Flex>
      </div>
      <Button onClick={login}>登录</Button>
    </>
  );
}
