import { Box, Heading, ScrollArea, Text } from "@radix-ui/themes";
import { useMemo } from "react";
import useBreakpoint from "../../hooks/useBreakpoint";
import { IAnswer } from "../../stores/problems";

export default function Answer(props: IAnswer & { name: string }) {
  const { isSmallScreen } = useBreakpoint();

  const size = useMemo(() => {
    return isSmallScreen ? "3" : "4";
  }, [isSmallScreen]);

  return (
    <ScrollArea>
      <Box py={size}>
        <Heading as="h2" size={size}>
          {props.name}
        </Heading>
      </Box>
      <div>
        <Text>{props.author}</Text>
      </div>
      <Box py={size}>
        <Text size={isSmallScreen ? "2" : "3"}>{props.answer}</Text>
      </Box>
    </ScrollArea>
  );
}
