import { useRef, useState } from "react";

export default function useCountdown(initial: number, immediate?: boolean) {
  const _remaining = useRef(initial);
  const timer = useRef<number | undefined>();
  const [remaining, setRemaining] = useState(initial);

  function countdown() {
    _remaining.current -= 1;
    setRemaining((remaining) => remaining - 1);
  }

  function start() {
    timer.current = setInterval(countdown, 1000);
  }

  function stop() {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = undefined;
    }
  }

  function restart() {
    stop();
    _remaining.current = initial;
    setRemaining(initial);
    start();
  }

  if (immediate) {
    start();
  }

  return { remaining, start, stop, restart };
}
