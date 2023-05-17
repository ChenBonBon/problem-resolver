import { message } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProblemForm from "../components/ProblemForm";
import request from "../request";

async function fetchProblem(id: string) {
  const res = await request(`/api/problems/${id}`);

  return res ?? {};
}

export default function EditProblem() {
  const params = useParams();
  const [data, setData] = useState({});
  const { id } = params;

  async function updateProblem(values: any) {
    const res = await request(
      `/api/problems/${id}`,
      "PUT",
      JSON.stringify(values)
    );

    if (res) {
      message.success("问题更新成功");
    }
  }

  useEffect(() => {
    async function fetchData() {
      if (id) {
        const res = await fetchProblem(id);
        setData(res ?? {});
      }
    }

    fetchData();
  }, []);

  return <ProblemForm data={data} onFinish={updateProblem} />;
}
