import { Box, Flex, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useToggle } from "react-use";
import Button from "../../components/Button";
import ErrorText from "../../components/ErrorText";
import useLogin from "../../hooks/useLogin";

export default function CodeForm() {
  const [form, setForm] = useState({
    email: "",
    code: "",
  });

  const [emailError, toggleEmailError] = useToggle(false);
  const [codeError, toggleCodeError] = useToggle(false);

  const { sended, loginWithCode, getCode } = useLogin();

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
              if (form.email.length === 0) {
                toggleEmailError(true);
                return;
              } else {
                toggleEmailError(false);
              }

              getCode(form.email);
            }}
          >
            发送验证码
          </Button>
        </Flex>
        {codeError && <ErrorText>请输入验证码</ErrorText>}
      </div>
      <Button
        onClick={() => {
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

          loginWithCode(form.email, form.code);
        }}
      >
        登录
      </Button>
    </>
  );
}
