import { Box, Flex, Heading, ScrollArea, Text } from "@radix-ui/themes";
import { useMemo } from "react";
import useBreakpoint from "../../hooks/useBreakpoint";
import { IExample, IProblemBase } from "../../stores/problems";
import { renderDifficulty } from "../Problems";
import Example from "./Example";

interface IDescription {
  id: string;
  name: string;
  difficulty: IProblemBase["difficulty"];
  description: string;
  examples: IExample[];
}

export default function Description(props: IDescription) {
  const { isSmallScreen } = useBreakpoint();

  const size = useMemo(() => {
    return isSmallScreen ? "3" : "4";
  }, [isSmallScreen]);

  return (
    <ScrollArea style={{ height: "calc(100vh - 88px - 56px - 40px)" }}>
      <Box py={size}>
        <Heading as="h2" size={size}>
          {props.id}.{props.name}
        </Heading>
      </Box>
      <div>{renderDifficulty(props.difficulty)}</div>
      <Box py={size}>
        <Text size={isSmallScreen ? "2" : "3"}>{props.description}</Text>
      </Box>
      <Flex direction="column" gap="5">
        {props.examples.map((example, index) => (
          <Example key={example.id} index={index} {...example} />
        ))}
      </Flex>
    </ScrollArea>
  );
}
