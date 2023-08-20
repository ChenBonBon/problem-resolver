import { TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useToggle } from "react-use";
import Button from "../../components/Button";
import ErrorText from "../../components/ErrorText";
import useLogin from "../../hooks/useLogin";

export default function PasswordForm() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [usernameError, toggleUsernameError] = useToggle(false);
  const [passwordError, togglePasswordError] = useToggle(false);

  const { loginWithPassword } = useLogin();

  return (
    <>
      <div>
        <TextField.Input
          placeholder="账号/邮箱"
          onChange={(e) => {
            setForm({
              ...form,
              username: e.target.value,
            });
          }}
        />
        {usernameError && <ErrorText>请输入账号或邮箱</ErrorText>}
      </div>
      <div>
        <TextField.Input
          placeholder="输入密码"
          onChange={(e) => {
            setForm({
              ...form,
              password: e.target.value,
            });
          }}
        />
        {passwordError && <ErrorText>请输入密码</ErrorText>}
      </div>
      <Button
        onClick={() => {
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

          loginWithPassword(form.username, form.password);
        }}
      >
        登录
      </Button>
    </>
  );
}
