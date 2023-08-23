import { TextField } from "@radix-ui/themes";
import { useState } from "react";
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

  return (
    <>
      <FormItem
        required
        errorText="请输入账号或邮箱"
        status={usernameError ? "error" : "success"}
      >
        <TextField.Input
          placeholder="账号/邮箱"
          onChange={(e) => {
            setForm({
              ...form,
              username: e.target.value,
            });
          }}
        />
      </FormItem>
      <FormItem
        required
        errorText="请输入密码"
        status={passwordError ? "error" : "success"}
      >
        <TextField.Input
          placeholder="输入密码"
          onChange={(e) => {
            setForm({
              ...form,
              password: e.target.value,
            });
          }}
        />
      </FormItem>
      <Button
        onClick={async () => {
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
        }}
      >
        登录
      </Button>
    </>
  );
}
