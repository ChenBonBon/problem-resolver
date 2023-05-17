import { message } from "antd";
import ProblemForm from "../components/ProblemForm";
import request from "../request";

async function createProblem(values: any) {
  const res = await request("/api/problems", "POST", JSON.stringify(values));

  if (res) {
    message.success("创建问题成功");
  }
}

export default function EditProblem() {
  return <ProblemForm onFinish={createProblem} />;
}
