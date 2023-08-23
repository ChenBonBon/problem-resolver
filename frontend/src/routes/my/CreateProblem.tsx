import { Flex, Select, TextArea, TextField } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToggle } from "react-use";
import { styled } from "styled-components";
import useSWR from "swr";
import Button from "../../components/Button";
import FormItem from "../../components/FormItem";
import useBreakpoint from "../../hooks/useBreakpoint";
import useLoading from "../../hooks/useLoading";
import useToast from "../../hooks/useToast";

const Wrapper = styled.div<{ maxwidth?: number }>`
  max-width: ${(props) => props.maxwidth}px;
`;

export default function CreateProblem() {
  const navigate = useNavigate();
  const { smallScreen } = useBreakpoint();
  const [form, setForm] = useState({
    name: "",
    description: "",
    difficulty: "",
  });

  const [nameError, toggleNameError] = useToggle(false);
  const [descriptionError, toggleDescriptionError] = useToggle(false);
  const [difficultyError, toggleDifficultyError] = useToggle(false);
  const [submitting, toggleSubmitting] = useToggle(false);

  const { data, isLoading } = useSWR<{
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
    if (form.description.length === 0) {
      toggleDescriptionError(true);
      return;
    } else {
      toggleDescriptionError(false);
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
    setLoading(isLoading);

    if (!isLoading) {
      toggleSubmitting(false);
    }

    if (data && data.code === 0) {
      showToast("success", "创建成功");
      navigate("/my-problems");
    }
  }, [
    data,
    isLoading,
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
        <FormItem
          label="描述"
          required
          errorText="请输入问题描述"
          status={descriptionError ? "error" : "success"}
        >
          <TextArea
            placeholder="请输入问题描述"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
            <Select.Content>
              <Select.Item value="easy">简单</Select.Item>
              <Select.Item value="medium">中等</Select.Item>
              <Select.Item value="hard">困难</Select.Item>
            </Select.Content>
          </Select.Root>
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
