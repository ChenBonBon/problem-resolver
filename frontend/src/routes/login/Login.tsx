import { Form, Input } from "antd";

export default function LoginFormItems() {
  return (
    <>
      <Form.Item name="username" label="用户名">
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item name="password" label="密码">
        <Input.Password placeholder="请输入密码" />
      </Form.Item>
    </>
  );
}
