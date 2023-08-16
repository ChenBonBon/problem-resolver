import { Grid, Tabs } from "@radix-ui/themes";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import LinkText from "../../components/LinkText";
import useLoading from "../../hooks/useLoading";
import useToast from "../../hooks/useToast";
import { IProblem } from "../../stores/problems";
import { addNumberUnit } from "../../utils";
import Description from "./Description";

export default function Problem() {
  const { id } = useParams();

  const { data, error, isLoading } = useSWR<{
    code: number;
    data: IProblem;
  }>(`/api/problems/${id}`);

  const { setVisible, setDescription } = useToast();
  const { setIsLoading } = useLoading();

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
    <Grid columns="2" gap="5">
      <Tabs.Root defaultValue="description">
        <Tabs.List size="2">
          <Tabs.Trigger value="description">
            <LinkText>题目描述</LinkText>
          </Tabs.Trigger>
          <Tabs.Trigger value="comments">
            <LinkText>
              讨论（{addNumberUnit(data?.data.comments ?? 0)}）
            </LinkText>
          </Tabs.Trigger>
          <Tabs.Trigger value="answers">
            <LinkText>
              题解（{addNumberUnit(data?.data.answers ?? 0)}）
            </LinkText>
          </Tabs.Trigger>
          <Tabs.Trigger value="commits">
            <LinkText>提交记录</LinkText>
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="description">
          {data && data.data && <Description {...data.data} />}
        </Tabs.Content>
      </Tabs.Root>
      <div>2</div>
    </Grid>
  );
}
