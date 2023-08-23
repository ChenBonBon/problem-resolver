import { useRef, useState } from "react";

export default function useCountdownRaf(initial: number, immediate?: boolean) {
  const current = new Date().getTime();
  const nextTime = useRef(current + 1000);
  const _remaining = useRef(initial);
  const timer = useRef<number | undefined>();

  const [remaining, setRemaining] = useState(initial);

  function countdown() {
    const now = new Date().getTime();
    if (_remaining.current > 0) {
      if (now >= nextTime.current) {
        nextTime.current = now + 1000;
        _remaining.current -= 1;
        setRemaining((remaining) => remaining - 1);
      }
      timer.current = requestAnimationFrame(countdown);
    } else {
      if (timer.current) {
        cancelAnimationFrame(timer.current);
      }
    }
  }

  function start() {
    timer.current = requestAnimationFrame(countdown);
  }

  function stop() {
    if (timer.current) {
      cancelAnimationFrame(timer.current);
      timer.current = undefined;
    }
  }

  function restart() {
    _remaining.current = initial;
    setRemaining(initial);
    start();
  }

  if (immediate) {
    start();
  }

  return { remaining, start, stop, restart };
}
