import { Flex, Grid, Heading, Tabs } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import Button from "../../components/Button";
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
    msg: string;
    data: IProblem;
  }>(`/api/problems/${id}`);

  const { setType, setVisible, setDescription } = useToast();
  const { setLoading } = useLoading();
  const { smallScreen } = useBreakpoint();
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
    msg: string;
    data: IAnswer;
  }>(submitting ? `/api/answers?problem=${id}&label=official` : null);

  useEffect(() => {
    setLoading(problemIsLoading);

    if (problemError) {
      setType("error");
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
    setLoading,
    setProblem,
    setType,
    setVisible,
  ]);

  useEffect(() => {
    setLoading(answerIsLoading);

    if (!answerIsLoading) {
      setSubmitting(false);
    }

    if (answerError) {
      setType("error");
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
    setLoading,
    setProblem,
    setType,
    setVisible,
  ]);

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        body: JSON.stringify({ name: value }),
      });

      console.log(res);
    } catch (error) {
      console.error(error);
    }
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
        <Heading as="h3" size={smallScreen ? "2" : "3"}>
          答题区域
        </Heading>
        <Editor value={value} onChange={setValue} />
        {problem && answer && <Answer name={problem.name} {...answer} />}
        <Flex py="3" justify="end" gap="3">
          <Button
            onClick={reset}
            disabled={value.length === 0 || submitting}
            variant="soft"
          >
            重做
          </Button>
          <Button
            onClick={submit}
            disabled={value.length === 0 || submitting}
            color="green"
          >
            提交
          </Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
