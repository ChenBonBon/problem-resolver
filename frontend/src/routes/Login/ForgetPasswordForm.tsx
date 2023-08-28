import { TextField } from "@radix-ui/themes";
import { ChangeEvent, useCallback, useState } from "react";
import { useToggle } from "react-use";
import Button from "../../components/Button";
import FormItem from "../../components/FormItem";
import useLogin from "../../hooks/useLogin";

export default function ForgetPasswordForm() {
  const [form, setForm] = useState({
    username: "",
  });
  const [usernameError, toggleUsernameError] = useToggle(false);
  const { forget } = useLogin();

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, key: string) => {
      setForm({
        ...form,
        [key]: e.target.value,
      });
    },
    [form]
  );

  const usernameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e, "username");
    },
    [onChange]
  );

  const forgetPassword = useCallback(async () => {
    if (form.username.length === 0) {
      toggleUsernameError(true);
      return;
    } else {
      toggleUsernameError(false);
    }

    await forget(form.username);
  }, [forget, form.username, toggleUsernameError]);

  return (
    <>
      <FormItem
        required
        errorText="请输入账号或邮箱"
        status={usernameError ? "error" : "success"}
      >
        <TextField.Input placeholder="账号/邮箱" onChange={usernameChange} />
      </FormItem>
      <Button onClick={forgetPassword}>忘记密码</Button>
    </>
  );
}
