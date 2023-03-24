import { Badge, Button, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ControlBar from "../components/ControlBar";
import { Difficulties } from "../constants";
import { findTargetValueInArray, request } from "../utils";

const columns = [
  {
    key: "title",
    title: "标题",
    dataIndex: "title",
    render: (text, item) => {
      const { _id } = item;
      return <Link to={`/problem/${_id}`}>{text}</Link>;
    },
  },
  {
    key: "difficulty",
    title: "难度",
    dataIndex: "difficulty",
    render: (text) => {
      return (
        <Space>
          <Badge
            color={findTargetValueInArray(Difficulties, "value", text, "color")}
          ></Badge>
          {findTargetValueInArray(Difficulties, "value", text, "label")}
        </Space>
      );
    },
  },
  {
    key: "status",
    title: "状态",
    dataIndex: "status",
    render: (text) => {
      return (
        <Space>
          <Badge status={text ? "success" : "error"}></Badge>
          {text ? "已启用" : "未启用"}
        </Space>
      );
    },
  },
  {
    key: "actions",
    title: "操作",
    render: () => {
      return (
        <Space>
          <Button type="link">启用</Button>
          <Button type="link">禁用</Button>
        </Space>
      );
    },
  },
];

async function fetchProblems() {
  const res = await request("/api/problems");

  return res ?? {};
}

export default function ProblemSet() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetchProblems();
      setData(res?.data ?? []);
    }

    fetchData();
  }, []);

  return (
    <div>
      <ControlBar>
        <Button
          type="primary"
          onClick={() => {
            navigate("/problem");
          }}
        >
          新建问题
        </Button>
      </ControlBar>
      <Table columns={columns} dataSource={data} rowKey={(item) => item._id} />
    </div>
  );
}
