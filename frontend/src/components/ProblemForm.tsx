import { Form as AntForm, Button, Input, Select, Space, Switch } from "antd";
import { useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Difficulties } from "../constants";

interface IProblemForm {
  data?: any;
  onFinish: (values: any) => void;
}

const Form = styled(AntForm)`
  margin: 24px 20%;
`;

const Editor = styled(ReactQuill)`
  background-color: white;
`;

export default function ProblemForm({ data = {}, onFinish }: IProblemForm) {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(data);

    return () => {
      form.resetFields();
    };
  }, [data]);

  return (
    <Form
      form={form}
      colon={false}
      layout="vertical"
      initialValues={{ answer: "", status: false }}
      onFinish={onFinish}
    >
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: "问题标题不能为空" }]}
      >
        <Input placeholder="请输入问题标题" />
      </Form.Item>
      <Form.Item
        name="description"
        label="描述"
        rules={[{ required: true, message: "问题描述不能为空" }]}
      >
        <Input.TextArea placeholder="请输入问题描述" />
      </Form.Item>
      <Form.Item name="answer" label="参考答案">
        <Editor theme="snow" />
      </Form.Item>
      <Form.Item
        name="difficulty"
        label="难度"
        rules={[{ required: true, message: "问题难度不能为空" }]}
      >
        <Select placeholder="请选择问题难度">
          {Difficulties.map((difficulty) => (
            <Select.Option key={difficulty.key} value={difficulty.value}>
              {difficulty.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="status" label="是否启用" valuePropName="checked">
        <Switch></Switch>
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button
            onClick={() => {
              navigate("/problem-set");
            }}
          >
            返回
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
