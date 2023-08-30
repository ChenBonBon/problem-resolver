import { Flex, Grid, Heading, Tabs } from "@radix-ui/themes";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffectOnce, useToggle } from "react-use";
import Button from "../../components/Button";
import LinkText from "../../components/LinkText";
import useBreakpoint from "../../hooks/useBreakpoint";
import { getProblem, submitProblem } from "../../requests/problems";
import useLoadingStore from "../../stores/loading";
import useProblemsStore from "../../stores/problems";
import { addNumberUnit } from "../../utils";
import Answer from "./Answer";
import Description from "./Description";
import Editor from "./Editor";

export default function Problem() {
    const { id: idStr } = useParams();
    let id = 0;

    if (idStr) {
        id = parseInt(idStr, 10);
    }

    const { smallScreen } = useBreakpoint();
    const problem = useProblemsStore((state) => state.problem);
    const answer = useProblemsStore((state) => state.answer);
    const loading = useLoadingStore((state) => state.loading);

    const [value, setValue] = useState("");
    const [submitted, toggleSubmitted] = useToggle(false);

    useEffectOnce(() => {
        getProblem(id);
    });

    const submit = async () => {
        const res = await submitProblem(id, value);

        if (res && res.code === 0) {
            toggleSubmitted();
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
                        <LinkText>
                            讨论（{addNumberUnit(problem?.comments ?? 0)}）
                        </LinkText>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="answers">
                        <LinkText>
                            题解（{addNumberUnit(problem?.answers ?? 0)}）
                        </LinkText>
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
                {submitted && <Answer answer={answer} />}
                <Flex py="3" justify="end" gap="3">
                    <Button
                        onClick={reset}
                        disabled={value.length === 0 || loading}
                        variant="soft"
                    >
                        重做
                    </Button>
                    <Button
                        onClick={submit}
                        disabled={value.length === 0 || loading}
                        color="green"
                    >
                        提交
                    </Button>
                </Flex>
            </Flex>
        </Grid>
    );
}
