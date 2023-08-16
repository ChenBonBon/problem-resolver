import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import { useMemo } from "react";
import useBreakpoint from "../../hooks/useBreakpoint";
import { IExample, IProblemBase } from "../../stores/problems";
import { renderStatus } from "../Problems";
import Example from "./Example";

interface IDescription {
  id: string;
  name: string;
  difficulty: IProblemBase["difficulty"];
  status: IProblemBase["status"];
  description: string;
  examples: IExample[];
}

export default function Description(props: IDescription) {
  const { isSmallScreen } = useBreakpoint();

  const size = useMemo(() => {
    return isSmallScreen ? "2" : "3";
  }, [isSmallScreen]);

  return (
    <div>
      <Box py={size}>
        <Heading as="h2" size={size}>
          {props.id}.{props.name}
        </Heading>
      </Box>
      <div>{renderStatus(props.status)}</div>
      <Box py={size}>
        <Text size={isSmallScreen ? "1" : "2"}>{props.description}</Text>
      </Box>
      <Flex direction="column" gap="5">
        {props.examples.map((example, index) => (
          <Example key={example.id} index={index} {...example} />
        ))}
      </Flex>
    </div>
  );
}
