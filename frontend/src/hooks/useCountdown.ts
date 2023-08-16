import { useRef, useState } from "react";

export default function useCountdown(initial: number) {
  const current = new Date().getTime();
  const nextTime = useRef(current + 1000);
  const _remaining = useRef(initial);
  const timer = useRef<number | undefined>();

  const [remaining, setRemaining] = useState(initial);

  const countdown = () => {
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
  };

  timer.current = requestAnimationFrame(countdown);

  return remaining;
}
