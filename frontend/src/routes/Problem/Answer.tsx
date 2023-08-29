import { Box, ScrollArea, Text } from "@radix-ui/themes";
import { useMemo } from "react";
import useBreakpoint from "../../hooks/useBreakpoint";
import { IAnswer } from "../../stores/problems";

export default function Answer(props: IAnswer) {
    const { smallScreen } = useBreakpoint();

    const size = useMemo(() => {
        return smallScreen ? "3" : "4";
    }, [smallScreen]);

    return (
        <ScrollArea>
            <Box py={size}>
                <Text size={smallScreen ? "2" : "3"}>{props.answer}</Text>
            </Box>
        </ScrollArea>
    );
}
