import { Form, Input } from "antd";

export default function RegisterFormItems() {
  return (
    <>
      <Form.Item name="email" label="Email">
        <Input type="email" />
      </Form.Item>
    </>
  );
}
