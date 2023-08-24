import { Box, Table as DefaultTable, Flex } from "@radix-ui/themes";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEffectOnce } from "react-use";
import Badge, { IBadge } from "../../components/Badge";
import Button from "../../components/Button";
import LinkText from "../../components/LinkText";
import Table, { TableCell, TableRowHeaderCell } from "../../components/Table";
import { difficultyMap } from "../../constants";
import useToast from "../../hooks/useToast";
import { getUserProblems, updateProblem } from "../../requests/problems";
import useProblemsStore from "../../stores/problems";
import { date } from "../../utils";

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

  const userProblems = useProblemsStore((state) => state.userProblems);

  const { showToast } = useToast();

  async function updateStatus(id: number, status: Status) {
    const res = await updateProblem(id, {
      status,
    });

    if (res && res.code === 0) {
      showToast("success", "操作成功");
      getUserProblems();
    }
  }

  async function enable(id: number) {
    await updateStatus(id, "enabled");
  }

  async function disable(id: number) {
    await updateStatus(id, "disabled");
  }

  const TableBody = useMemo(() => {
    return userProblems.map((problem) => (
      <DefaultTable.Row key={problem.id}>
        <TableRowHeaderCell maxwidth={640}>{problem.name}</TableRowHeaderCell>
        <TableCell>{problem.types.join(" ")}</TableCell>
        <TableCell>
          <Badge map={difficultyMap} value={problem.difficulty} />
        </TableCell>
        <TableCell>
          <Badge map={statusMap} value={problem.status} />
        </TableCell>
        <TableCell>{date(problem.createdAt)}</TableCell>
        <TableCell>
          <Flex gap="3">
            <LinkText>编辑</LinkText>
            {problem.status === "disabled" && (
              <LinkText
                onClick={() => {
                  enable(problem.id);
                }}
              >
                启用
              </LinkText>
            )}
            {problem.status === "enabled" && (
              <LinkText
                onClick={() => {
                  disable(problem.id);
                }}
              >
                禁用
              </LinkText>
            )}
          </Flex>
        </TableCell>
      </DefaultTable.Row>
    ));
  }, [userProblems]);

  useEffectOnce(() => {
    getUserProblems();
  });

  return (
    <Box>
      <Flex justify="end">
        <Button
          onClick={() => {
            navigate("/problems/new");
          }}
        >
          新增
        </Button>
      </Flex>
      <Table columns={columns}>{TableBody}</Table>
    </Box>
  );
}
