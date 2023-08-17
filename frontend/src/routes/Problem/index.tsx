import { Flex, Grid, Heading, Tabs } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import StyledButton from "../../components/Button";
import LinkText from "../../components/LinkText";
import useBreakpoint from "../../hooks/useBreakpoint";
import useLoading from "../../hooks/useLoading";
import useToast from "../../hooks/useToast";
import useProblemsStore, { IAnswer, IProblem } from "../../stores/problems";
import { addNumberUnit } from "../../utils";
import Answer from "./Answer";
import Description from "./Description";
import Editor from "./Editor";

export default function Problem() {
  const { id } = useParams();

  const {
    data: problemData,
    error: problemError,
    isLoading: problemIsLoading,
  } = useSWR<{
    code: number;
    data: IProblem;
  }>(`/api/problems/${id}`);

  const { setVisible, setDescription } = useToast();
  const { setIsLoading } = useLoading();
  const { isSmallScreen } = useBreakpoint();
  const problem = useProblemsStore((state) => state.problem);
  const answer = useProblemsStore((state) => state.answer);
  const setProblem = useProblemsStore((state) => state.setProblem);
  const setAnswer = useProblemsStore((state) => state.setAnswer);

  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState("");

  const {
    data: answerData,
    error: answerError,
    isLoading: answerIsLoading,
  } = useSWR<{
    code: number;
    data: IAnswer;
  }>(submitting ? `/api/answers?problem=${id}&label=official` : null);

  useEffect(() => {
    setIsLoading(problemIsLoading);

    if (problemError) {
      setDescription("Oops, 接口异常了");
      setVisible(true);
      setProblem(null);
    }

    if (problemData) {
      setProblem(problemData.data);
    }
  }, [
    problemData,
    problemError,
    problemIsLoading,
    setAnswer,
    setDescription,
    setIsLoading,
    setProblem,
    setVisible,
  ]);

  useEffect(() => {
    setIsLoading(answerIsLoading);

    if (!answerIsLoading) {
      setSubmitting(false);
    }

    if (answerError) {
      setDescription("Oops, 接口异常了");
      setVisible(true);
      setAnswer(null);
    }

    if (answerData) {
      setAnswer(answerData.data);
    }
  }, [
    answerData,
    answerError,
    answerIsLoading,
    setAnswer,
    setDescription,
    setIsLoading,
    setProblem,
    setVisible,
  ]);

  const submit = () => {
    setSubmitting(true);
  };

  const reset = () => {
    setValue("");
  };

  return (
    <Grid columns="2" gap="5" height="100%">
      <Tabs.Root defaultValue="description">
        <Tabs.List size="2">
          <Tabs.Trigger value="description">
            <LinkText>题目描述</LinkText>
          </Tabs.Trigger>
          <Tabs.Trigger value="comments">
            <LinkText>讨论（{addNumberUnit(problem?.comments ?? 0)}）</LinkText>
          </Tabs.Trigger>
          <Tabs.Trigger value="answers">
            <LinkText>题解（{addNumberUnit(problem?.answers ?? 0)}）</LinkText>
          </Tabs.Trigger>
          <Tabs.Trigger value="commits">
            <LinkText>提交记录</LinkText>
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="description">
          {problem && <Description {...problem} />}
        </Tabs.Content>
      </Tabs.Root>
      <Flex direction="column" gap="3">
        <Heading as="h3" size={isSmallScreen ? "2" : "3"}>
          答题区域
        </Heading>
        <Editor value={value} onChange={setValue} />
        {problem && answer && <Answer name={problem.name} {...answer} />}
        <Flex py="3" justify="end" gap="3">
          <StyledButton
            onClick={reset}
            disabled={value.length === 0 || submitting}
            variant="soft"
          >
            重做
          </StyledButton>
          <StyledButton
            onClick={submit}
            disabled={value.length === 0 || submitting}
            color="green"
          >
            提交
          </StyledButton>
        </Flex>
      </Flex>
    </Grid>
  );
}
