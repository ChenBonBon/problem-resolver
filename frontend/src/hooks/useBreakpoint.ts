import { createBreakpoint } from "react-use";
import { smallBreakpoints } from "../constants";

export default function useBreakpoint() {
  const useBreakpoint = createBreakpoint({
    initial: 0,
    xs: 520,
    sm: 768,
    md: 1024,
    lg: 1280,
    xl: 1640,
  });

  const breakpoint = useBreakpoint();

  const smallScreen = smallBreakpoints.includes(breakpoint);

  return { breakpoint, smallScreen };
}
