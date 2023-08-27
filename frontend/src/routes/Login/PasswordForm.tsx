import { TextField } from "@radix-ui/themes";
import { ChangeEvent, useCallback, useState } from "react";
import { useToggle } from "react-use";
import Button from "../../components/Button";
import FormItem from "../../components/FormItem";
import useLogin from "../../hooks/useLogin";
import useRedirect from "../../hooks/useRedirect";

export default function PasswordForm() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [usernameError, toggleUsernameError] = useToggle(false);
  const [passwordError, togglePasswordError] = useToggle(false);

  const { loginWithPassword } = useLogin();
  const redirect = useRedirect();

  const usernameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setForm({
        ...form,
        username: e.target.value,
      });
    },
    [form]
  );

  const passwordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setForm({
        ...form,
        password: e.target.value,
      });
    },
    [form]
  );

  const login = useCallback(async () => {
    if (form.username.length === 0) {
      toggleUsernameError(true);
      return;
    } else {
      toggleUsernameError(false);
    }

    if (form.password.length === 0) {
      togglePasswordError(true);
      return;
    } else {
      togglePasswordError(false);
    }

    await loginWithPassword(form.username, form.password);
    redirect();
  }, [
    form.password,
    form.username,
    loginWithPassword,
    redirect,
    togglePasswordError,
    toggleUsernameError,
  ]);

  return (
    <>
      <FormItem
        required
        errorText="请输入账号或邮箱"
        status={usernameError ? "error" : "success"}
      >
        <TextField.Input placeholder="账号/邮箱" onChange={usernameChange} />
      </FormItem>
      <FormItem
        required
        errorText="请输入密码"
        status={passwordError ? "error" : "success"}
      >
        <TextField.Input placeholder="输入密码" onChange={passwordChange} />
      </FormItem>
      <Button onClick={login}>登录</Button>
    </>
  );
}
