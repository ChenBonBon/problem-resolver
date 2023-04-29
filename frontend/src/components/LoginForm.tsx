import { Button, Form, Input, message } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useToggle from "../hooks/useToggle";
import { request } from "../utils";

const ButtonWrapper = styled("div")`
  text-align: right;
`;

async function register(values: any) {
  return await request("/api/users/register", {
    method: "POST",
    body: JSON.stringify(values),
  });
}

async function login(values: any) {
  return await request("/api/users/login", {
    method: "POST",
    body: JSON.stringify(values),
  });
}

export default function LoginForm() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { value, toggle } = useToggle(true);

  async function onFinish(values: any) {
    if (value) {
      const res = await login(values);

      if (res) {
        message.success("登陆成功");
        localStorage.setItem("token", res.token);
        navigate("/");
      }
    } else {
      const res = await register(values);

      if (res) {
        message.success("注册成功");
        toggle();
      }
    }
  }

  useEffect(() => {
    form.resetFields();
  }, [value]);

  return (
    <Form form={form} colon={false} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="username"
        label="用户名"
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input type="password" />
      </Form.Item>
      {!value && (
        <Form.Item
          name="confirmPassword"
          label="确认密码"
          dependencies={["password"]}
          rules={[
            { required: true, message: "请输入确认密码" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("两次密码输入不一致"));
              },
            }),
          ]}
        >
          <Input type="password" />
        </Form.Item>
      )}
      <Form.Item>
        <ButtonWrapper>
          <Button type="link" onClick={toggle}>
            {value ? "没有账号，去注册" : "已有账号，去登陆"}
          </Button>
        </ButtonWrapper>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {value ? "登陆" : "注册"}
        </Button>
      </Form.Item>
    </Form>
  );
}
