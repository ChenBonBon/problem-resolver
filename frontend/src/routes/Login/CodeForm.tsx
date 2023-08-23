import { Box, Flex, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useToggle } from "react-use";
import Button from "../../components/Button";
import ErrorText from "../../components/ErrorText";
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

  return (
    <>
      <div>
        <TextField.Input
          placeholder="输入邮箱"
          onChange={(e) => {
            setForm({
              ...form,
              email: e.target.value,
            });
          }}
          readOnly={sended}
        />
        {emailError && <ErrorText>请输入邮箱</ErrorText>}
      </div>
      <div>
        <Flex gap="3">
          <Box width="100%">
            <TextField.Input
              placeholder="验证码"
              onChange={(e) => {
                setForm({
                  ...form,
                  code: e.target.value,
                });
              }}
            />
          </Box>
          <Button
            onClick={() => {
              if (sended && remaining > 0) {
                return;
              }

              if (form.email.length === 0) {
                toggleEmailError(true);
                return;
              } else {
                toggleEmailError(false);
              }

              getCode(form.email);

              if (sended) {
                restart();
              } else {
                start();
              }
            }}
            disabled={form.email.length === 0}
          >
            {sended && remaining > 0 ? `${remaining}秒` : "获取验证码"}
          </Button>
        </Flex>
        {codeError && <ErrorText>请输入验证码</ErrorText>}
      </div>
      <Button
        onClick={async () => {
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
        }}
      >
        登录
      </Button>
    </>
  );
}
