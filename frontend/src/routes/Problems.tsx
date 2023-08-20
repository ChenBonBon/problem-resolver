import { Table as DefaultTable, Link } from "@radix-ui/themes";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import Badge, { IBadge } from "../components/Badge";
import Table, { TableCell } from "../components/Table";
import { difficultyMap } from "../constants";
import useLoading from "../hooks/useLoading";
import useToast from "../hooks/useToast";
import { IProblemListItem } from "../stores/problems";

const columns = [
  {
    key: "status",
    label: "状态",
  },
  {
    key: "name",
    label: "题目",
  },
  {
    key: "group",
    label: "分类",
  },
  {
    key: "answers",
    label: "题解",
  },
  {
    key: "passRate",
    label: "通过率",
  },
  {
    key: "difficulty",
    label: "难度",
  },
];

const statusMap: IBadge["map"] = {
  unsolved: { label: "未解决", color: "crimson" },
  processing: { label: "进行中", color: "orange" },
  solved: { label: "已解决", color: "green" },
};

export default function Problems() {
  const navigate = useNavigate();

  const { data, error, isLoading } = useSWR<{
    code: number;
    msg: string;
    data: IProblemListItem[];
  }>("/api/problems");

  const { setType, setVisible, setDescription } = useToast();
  const { setIsLoading } = useLoading();

  const TableBody = useMemo(() => {
    if (data && data.data) {
      return data.data.map((problem) => (
        <DefaultTable.Row key={problem.id}>
          <DefaultTable.RowHeaderCell>
            <Badge map={statusMap} value={problem.status} />
          </DefaultTable.RowHeaderCell>
          <TableCell maxwidth={640}>
            <Link
              onClick={(e) => {
                e.preventDefault();
                navigate(`/problems/${problem.id}`);
              }}
            >
              {problem.name}
            </Link>
          </TableCell>
          <TableCell>{problem.group}</TableCell>
          <TableCell>{problem.answers}</TableCell>
          <TableCell>{problem.passRate}</TableCell>
          <TableCell>
            <Badge map={difficultyMap} value={problem.difficulty} />
          </TableCell>
        </DefaultTable.Row>
      ));
    }

    return null;
  }, [data, navigate]);

  useEffect(() => {
    if (isLoading) {
      setIsLoading(isLoading);
    }

    if (error) {
      setType("error");
      setDescription("Oops, 接口异常了");
      setVisible(true);
    }
  }, [error, isLoading, setDescription, setIsLoading, setVisible]);

  return (
    <Table columns={columns} isLoading={isLoading}>
      {TableBody}
    </Table>
  );
}
