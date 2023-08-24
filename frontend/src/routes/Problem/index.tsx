import { Flex, Grid, Heading, Tabs } from "@radix-ui/themes";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffectOnce, useToggle } from "react-use";
import Button from "../../components/Button";
import LinkText from "../../components/LinkText";
import useBreakpoint from "../../hooks/useBreakpoint";
import { getProblem } from "../../requests/problems";
import useProblemsStore from "../../stores/problems";
import { addNumberUnit } from "../../utils";
import Answer from "./Answer";
import Description from "./Description";
import Editor from "./Editor";

export default function Problem() {
  const { id } = useParams();

  const { smallScreen } = useBreakpoint();
  const problem = useProblemsStore((state) => state.problem);
  const answer = useProblemsStore((state) => state.answer);

  const [submitting, toggleSubmitting] = useToggle(false);
  const [value, setValue] = useState("");

  useEffectOnce(() => {
    if (id) {
      getProblem(parseInt(id, 10));
    }
  });

  const submit = async () => {
    toggleSubmitting(true);
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
