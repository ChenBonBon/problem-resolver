import { Flex, Select, TextArea, TextField } from "@radix-ui/themes";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffectOnce, useToggle } from "react-use";
import { styled } from "styled-components";
import BadgeGroup from "../../components/BadgeGroup";
import Button from "../../components/Button";
import FormItem from "../../components/FormItem";
import { difficultyMap } from "../../constants";
import useBreakpoint from "../../hooks/useBreakpoint";
import useToast from "../../hooks/useToast";
import { addProblem, getProblemTypes } from "../../requests/problems";
import useProblemsStore, { ICreateProblemForm } from "../../stores/problems";

const Wrapper = styled.div<{ maxwidth?: number }>`
  max-width: ${(props) => props.maxwidth}px;
`;

export default function CreateProblem() {
  const navigate = useNavigate();
  const problemTypes = useProblemsStore((state) => state.problemTypes);

  const { smallScreen } = useBreakpoint();
  const [form, setForm] = useState<ICreateProblemForm>({
    title: "",
    description: "",
    answer: "",
    difficulty: "",
    types: [],
  });

  const [nameError, toggleNameError] = useToggle(false);
  const [difficultyError, toggleDifficultyError] = useToggle(false);

  const { showToast } = useToast();

  const maxwidth = useMemo(() => {
    return smallScreen ? 450 : 600;
  }, [smallScreen]);

  const options = useMemo(() => {
    return Object.keys(difficultyMap).map((key) => {
      const { label } = difficultyMap[key];

      return (
        <Select.Item key={key} value={key}>
          {label}
        </Select.Item>
      );
    });
  }, []);

  async function submit() {
    if (form.title.length === 0) {
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

    const res = await addProblem(form);

    if (res && res.code === 0) {
      showToast("success", "创建成功");
      navigate("/my-problems");
    }
  }

  const titleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, title: e.target.value }),
    [form]
  );

  const descriptionChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) =>
      setForm({ ...form, description: e.target.value }),
    [form]
  );

  const answerChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) =>
      setForm({ ...form, answer: e.target.value }),
    [form]
  );

  const difficultyChange = useCallback(
    (value: string) => {
      setForm({ ...form, difficulty: value });
    },
    [form]
  );

  const typesChange = useCallback(
    (value: number[]) => {
      setForm({ ...form, types: value });
    },
    [form]
  );

  const cancel = useCallback(() => {
    navigate("/my-problems");
  }, [navigate]);

  useEffectOnce(() => {
    getProblemTypes("enabled");
  });

  return (
    <Wrapper maxwidth={maxwidth}>
      <Flex direction="column" gap="5">
        <FormItem
          label="问题"
          required
          errorText="请输入问题"
          status={nameError ? "error" : "success"}
        >
          <TextField.Input placeholder="请输入问题" onChange={titleChange} />
        </FormItem>
        <FormItem label="描述">
          <TextArea placeholder="请输入问题描述" onChange={descriptionChange} />
        </FormItem>
        <FormItem label="题解">
          <TextArea placeholder="请输入官方题解" onChange={answerChange} />
        </FormItem>
        <FormItem
          label="难度"
          required
          errorText="请选择难度"
          status={difficultyError ? "error" : "success"}
        >
          <Select.Root onValueChange={difficultyChange}>
            <Select.Trigger placeholder="请选择难度" />
            <Select.Content position="popper">{options}</Select.Content>
          </Select.Root>
        </FormItem>
        <FormItem label="分类">
          <BadgeGroup items={problemTypes} onChange={typesChange} />
        </FormItem>
        <Flex gap="5">
          <Button onClick={submit}>提交</Button>
          <Button highContrast onClick={cancel}>
            取消
          </Button>
        </Flex>
      </Flex>
    </Wrapper>
  );
}
