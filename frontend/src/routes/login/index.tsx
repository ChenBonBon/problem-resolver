import { Button, Form, message } from "antd";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import LoginFormItems from "./Login.tsx";
import RegisterFormItems from "./Register.tsx";

type LoginType = "login" | "register";

interface ISwitchButton {
  children: ReactNode;
  onClick: () => void;
}

const SwitchText = {
  login: "暂时没有账号，去注册",
  register: "已有账号，去登陆",
};

const ButtonText = {
  login: "登陆",
  register: "注册",
};

function SwitchButton(props: ISwitchButton) {
  return (
    <Button type="link" onClick={props.onClick}>
      {props.children}
    </Button>
  );
}
const LoginWrapper = styled("div")`
  margin: 24px 20%;
`;

const ButtonWrapper = styled("div")`
  text-align: right;
`;

export default function Login() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [type, setType] = useState<LoginType>("login");
  const [canSubmit, setCanSubmit] = useState(true);
  const [sended, setSended] = useState(false);

  const onFinish = useCallback(
    async (values: any) => {
      if (type === "login") {
      } else {
        const { email, code, password } = values;
        const res = await dispatch.user.register({ email, code, password });

        if (res) {
          message.success("注册成功");
          setType("login");
        }
      }
    },
    [type]
  );

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, [type]);

  useEffect(() => {
    if (type === "login") {
      setCanSubmit(true);
    } else {
      if (sended) {
        setCanSubmit(true);
      } else {
        setCanSubmit(false);
      }
    }
  }, [type, sended]);

  return (
    <LoginWrapper>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        {type === "login" && <LoginFormItems />}
        {type === "register" && (
          <RegisterFormItems
            onSend={async () => {
              const email = form.getFieldValue("email");
              const res = await dispatch.user.verification({ email });

              if (res) {
                setSended(true);
              }

              return res;
            }}
          />
        )}
        <Form.Item>
          <ButtonWrapper>
            <SwitchButton
              onClick={() => {
                if (type === "login") {
                  setType("register");
                } else {
                  setType("login");
                }
              }}
            >
              {SwitchText[type]}
            </SwitchButton>
          </ButtonWrapper>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block disabled={!canSubmit}>
            {ButtonText[type]}
          </Button>
        </Form.Item>
      </Form>
    </LoginWrapper>
  );
}
