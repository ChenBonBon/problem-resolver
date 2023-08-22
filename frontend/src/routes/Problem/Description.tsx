import { Box, Flex, Heading, ScrollArea, Text } from "@radix-ui/themes";
import { useMemo } from "react";
import Badge from "../../components/Badge";
import { difficultyMap } from "../../constants";
import useBreakpoint from "../../hooks/useBreakpoint";
import { IExample, IProblemBase } from "../../stores/problems";
import Example from "./Example";

interface IDescription {
  id: string;
  name: string;
  difficulty: IProblemBase["difficulty"];
  description: string;
  examples: IExample[];
}

export default function Description(props: IDescription) {
  const { smallScreen } = useBreakpoint();

  const size = useMemo(() => {
    return smallScreen ? "3" : "4";
  }, [smallScreen]);

  return (
    <ScrollArea style={{ height: "calc(100vh - 88px - 56px - 40px)" }}>
      <Box py={size}>
        <Heading as="h2" size={size}>
          {props.id}.{props.name}
        </Heading>
      </Box>
      <div>
        <Badge map={difficultyMap} value={props.difficulty} />
      </div>
      <Box py={size}>
        <Text size={smallScreen ? "2" : "3"}>{props.description}</Text>
      </Box>
      <Flex direction="column" gap="5">
        {props.examples.map((example, index) => (
          <Example key={example.id} index={index} {...example} />
        ))}
      </Flex>
    </ScrollArea>
  );
}
