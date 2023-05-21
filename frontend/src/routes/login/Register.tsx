import { Button, Col, Form, Input, Row, message } from "antd";
import { useEffect, useState } from "react";
import useCountdown from "../../hooks/useCountdown";

interface IRegisterFormItems {
  onSend?: () => any;
}

export default function RegisterFormItems(props: IRegisterFormItems) {
  const [text, setText] = useState("发送验证码");
  const [sended, setSended] = useState(false);
  const [canSend, setCanSend] = useState(false);
  const { counter, status, start, restart } = useCountdown();

  useEffect(() => {
    if (status === "RUNNING" && sended) {
      setText(counter.toString());
    } else if (sended) {
      setText("再次发送");
    } else {
      setText("发送验证码");
    }
  }, [counter, sended, status]);

  return (
    <>
      <Form.Item label="Email">
        <Row gutter={8}>
          <Col span={18}>
            <Form.Item name="email" noStyle>
              <Input
                type="email"
                placeholder="请输入Email"
                readOnly={sended}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value && value.length > 0) {
                    if (
                      /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(
                        value
                      )
                    ) {
                      setCanSend(true);
                    } else {
                      setCanSend(false);
                    }
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item>
              <Button
                type={status === "RUNNING" ? "default" : "primary"}
                onClick={async () => {
                  if (props.onSend) {
                    const res = await Promise.resolve(props.onSend());
                    if (res) {
                      message.success("验证码发送成功，请查收");
                      setSended(true);
                      start();
                    }
                  }
                  if (sended) {
                    restart();
                  }
                }}
                disabled={!canSend || status === "RUNNING"}
                block
              >
                {text}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
      {sended && (
        <>
          <Form.Item
            name="code"
            label="验证码"
            wrapperCol={{ span: 18 }}
            rules={[{ required: true, message: "请输入验证码" }]}
          >
            <Input placeholder="请输入验证码" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            wrapperCol={{ span: 18 }}
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            wrapperCol={{ span: 18 }}
            dependencies={["password"]}
            rules={[
              { required: true, message: "请再次输入密码" },
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
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>
        </>
      )}
    </>
  );
}
