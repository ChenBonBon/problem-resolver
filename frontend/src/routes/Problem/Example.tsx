import { Blockquote, Box, Heading, Strong } from "@radix-ui/themes";
import { useMemo } from "react";
import useBreakpoint from "../../hooks/useBreakpoint";
import { IExample } from "../../stores/problems";

export default function Example(
  props: IExample & {
    index: number;
  }
) {
  const { smallScreen } = useBreakpoint();
  const size = useMemo(() => {
    return smallScreen ? "2" : "3";
  }, [smallScreen]);

  return (
    <div>
      <Box py={size}>
        <Heading as="h3" size={size}>
          示例 {props.index + 1}：
        </Heading>
      </Box>
      <Blockquote size={size}>
        <Strong>输入：</Strong>
        {props.input}
        <br />
        <Strong>输出：</Strong>
        {props.output}
        <br />
        <Strong>解释：</Strong>
        {props.explanation}
      </Blockquote>
    </div>
  );
}
