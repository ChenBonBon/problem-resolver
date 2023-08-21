import { Table as DefaultTable, Flex } from "@radix-ui/themes";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import Badge, { IBadge } from "../../components/Badge";
import Button from "../../components/Button";
import LinkText from "../../components/LinkText";
import Table, { TableCell, TableRowHeaderCell } from "../../components/Table";
import { difficultyMap } from "../../constants";
import { IUserProblem } from "../../stores/problems";

const columns = [
  {
    key: "name",
    label: "题目",
  },
  {
    key: "group",
    label: "分类",
  },
  {
    key: "difficulty",
    label: "难度",
  },
  {
    key: "status",
    label: "状态",
  },
  {
    key: "createdAt",
    label: "创建时间",
  },
  {
    key: "actions",
    label: "操作",
  },
];

const statusMap: IBadge["map"] = {
  disabled: { label: "禁用", color: "crimson" },
  enabled: { label: "启用", color: "green" },
};

export default function MyProblems() {
  const navigate = useNavigate();

  const { data, error, isLoading } = useSWR<{
    code: number;
    msg: string;
    data: IUserProblem[];
  }>("/api/users/problems");

  const TableBody = useMemo(() => {
    if (data && data.data) {
      return data.data.map((problem) => (
        <DefaultTable.Row key={problem.id}>
          <TableRowHeaderCell maxwidth={640}>{problem.name}</TableRowHeaderCell>
          <TableCell>{problem.group}</TableCell>
          <TableCell>
            <Badge map={difficultyMap} value={problem.difficulty} />
          </TableCell>
          <TableCell>
            <Badge map={statusMap} value={problem.status} />
          </TableCell>
          <TableCell>{problem.createdAt}</TableCell>
          <TableCell>
            <Flex gap="3">
              <LinkText>编辑</LinkText>
              <LinkText>启用</LinkText>
              <LinkText>禁用</LinkText>
            </Flex>
          </TableCell>
        </DefaultTable.Row>
      ));
    }

    return null;
  }, [data]);

  return (
    <div>
      <Flex justify="end">
        <Button
          onClick={() => {
            navigate("/problem/new");
          }}
        >
          新增
        </Button>
      </Flex>
      <Table columns={columns} isLoading={isLoading}>
        {TableBody}
      </Table>
    </div>
  );
}
