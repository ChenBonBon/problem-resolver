import { Badge, Table as DefaultTable, Link } from "@radix-ui/themes";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import useSWR from "swr";
import Table from "../components/Table";
import useLoading from "../hooks/useLoading";
import useToast from "../hooks/useToast";
import { getProblems } from "../requests/problems";
import { IProblem } from "../stores/problems";

const TableCell = styled(DefaultTable.Cell)<{ maxwidth?: number }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: ${(props) => props.maxwidth}px;
`;

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

export default function Problems() {
  const navigate = useNavigate();
  const { data, error, isLoading } = useSWR<{
    code: number;
    list: IProblem[];
  }>("/api/problems", getProblems);

  const { setVisible, setDescription } = useToast();
  const { setIsLoading } = useLoading();

  const renderStatus = useCallback((status: IProblem["status"]) => {
    const statusMap: {
      [key in IProblem["status"]]: {
        label: string;
        color: Color;
      };
    } = {
      unsolved: { label: "未解决", color: "crimson" },
      processing: { label: "进行中", color: "orange" },
      solved: { label: "已解决", color: "green" },
    };

    const { label, color } = statusMap[status];

    return <Badge color={color}>{label}</Badge>;
  }, []);

  const tableBody = useMemo(() => {
    if (data && data.list) {
      return data.list.map((problem) => (
        <DefaultTable.Row key={problem.id}>
          <DefaultTable.RowHeaderCell>
            {renderStatus(problem.status)}
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
          <TableCell>{problem.answers}</TableCell>
          <TableCell>{problem.passRate}</TableCell>
          <TableCell>{problem.difficulty}</TableCell>
        </DefaultTable.Row>
      ));
    }

    return null;
  }, [data, renderStatus]);

  useEffect(() => {
    if (isLoading) {
      setIsLoading(isLoading);
    }

    if (error) {
      setDescription("Oops, 接口异常了");
      setVisible(true);
    }
  }, [error, isLoading, setDescription, setIsLoading, setVisible]);

  return (
    <Table columns={columns} isLoading={isLoading}>
      {tableBody}
    </Table>
  );
}
