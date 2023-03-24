import { message } from "antd";
import ProblemForm from "../components/ProblemForm";
import { request } from "../utils";

async function createProblem(values) {
  const res = await request("/api/problems", {
    method: "POST",
    body: JSON.stringify(values),
  });

  if (res) {
    message.success("创建问题成功");
  }
}

export default function EditProblem() {
  return <ProblemForm onFinish={createProblem} />;
}
