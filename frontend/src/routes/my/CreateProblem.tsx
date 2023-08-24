import { Flex, Select, TextArea, TextField } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToggle } from "react-use";
import { styled } from "styled-components";
import useSWR from "swr";
import BadgeGroup from "../../components/BadgeGroup";
import Button from "../../components/Button";
import FormItem from "../../components/FormItem";
import { difficultyMap } from "../../constants";
import useBreakpoint from "../../hooks/useBreakpoint";
import useLoading from "../../hooks/useLoading";
import useToast from "../../hooks/useToast";

type ProblemType = {
  id: number;
  name: string;
};

interface ICreateProblemForm {
  name: string;
  description: string;
  answer: string;
  difficulty: string;
  types: number[];
}

const Wrapper = styled.div<{ maxwidth?: number }>`
  max-width: ${(props) => props.maxwidth}px;
`;

export default function CreateProblem() {
  const navigate = useNavigate();
  const { smallScreen } = useBreakpoint();
  const [form, setForm] = useState<ICreateProblemForm>({
    name: "",
    description: "",
    answer: "",
    difficulty: "",
    types: [],
  });

  const [nameError, toggleNameError] = useToggle(false);
  const [difficultyError, toggleDifficultyError] = useToggle(false);
  const [submitting, toggleSubmitting] = useToggle(false);

  const { data: problemTypesData, isLoading: problemTypesIsLoading } = useSWR<{
    code: number;
    msg: string;
    data: ProblemType[];
  }>("/api/problems/types?status=enabled");

  const { data: problemsData, isLoading: problemsIsLoading } = useSWR<{
    code: number;
    msg: string;
  }>(submitting ? ["/api/users/problems", "POST", form] : null);

  const { showToast } = useToast();
  const { setLoading } = useLoading();

  const maxwidth = useMemo(() => {
    return smallScreen ? 450 : 600;
  }, [smallScreen]);

  async function submit() {
    if (form.name.length === 0) {
      toggleNameError(true);
      return;
    } else {
      toggleNameError(false);
    }
    if (form.difficulty.length === 0) {
      toggleDifficultyError(true);
      return;
    } else {
      toggleDifficultyError(false);
    }

    toggleSubmitting(true);
  }

  useEffect(() => {
    setLoading(problemTypesIsLoading);

    if (!problemTypesIsLoading) {
      toggleSubmitting(false);
    }
  }, [problemTypesIsLoading, setLoading, toggleSubmitting]);

  useEffect(() => {
    setLoading(problemsIsLoading);

    if (!problemsIsLoading) {
      toggleSubmitting(false);
    }

    if (problemsData && problemsData.code === 0) {
      showToast("success", "创建成功");
      navigate("/my-problems");
    }
  }, [
    problemsData,
    problemsIsLoading,
    navigate,
    setLoading,
    showToast,
    toggleSubmitting,
  ]);

  return (
    <Wrapper maxwidth={maxwidth}>
      <Flex direction="column" gap="5">
        <FormItem
          label="问题"
          required
          errorText="请输入问题"
          status={nameError ? "error" : "success"}
        >
          <TextField.Input
            placeholder="请输入问题"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </FormItem>
        <FormItem label="描述">
          <TextArea
            placeholder="请输入问题描述"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </FormItem>
        <FormItem label="题解">
          <TextArea
            placeholder="请输入官方题解"
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
          />
        </FormItem>
        <FormItem
          label="难度"
          required
          errorText="请选择难度"
          status={difficultyError ? "error" : "success"}
        >
          <Select.Root
            onValueChange={(value) => {
              setForm({ ...form, difficulty: value });
            }}
          >
            <Select.Trigger placeholder="请选择难度" />
            <Select.Content position="popper">
              {Object.keys(difficultyMap).map((key) => {
                const { label } = difficultyMap[key];

                return (
                  <Select.Item key={key} value={key}>
                    {label}
                  </Select.Item>
                );
              })}
            </Select.Content>
          </Select.Root>
        </FormItem>
        <FormItem label="分类">
          <BadgeGroup
            items={problemTypesData?.data ?? []}
            onChange={(value) => {
              setForm({ ...form, types: value });
            }}
          />
        </FormItem>
        <Flex gap="5">
          <Button onClick={submit}>提交</Button>
          <Button
            highContrast
            onClick={() => {
              navigate("/my-problems");
            }}
          >
            取消
          </Button>
        </Flex>
      </Flex>
    </Wrapper>
  );
}
