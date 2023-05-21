import { useCallback, useEffect, useState } from "react";

type CountdownStatus = "NOT_STARTED" | "RUNNING" | "PAUSED" | "ENDED";

let interval: number;

export default function useCountdown(init?: number, step?: number) {
  const [counter, setCounter] = useState(init ?? 60);
  const [status, setStatus] = useState<CountdownStatus>("NOT_STARTED");
  const _step = step ?? 1;

  const countdown = useCallback(() => {
    setCounter((current) => current - _step);
  }, []);

  function start() {
    setStatus("RUNNING");
  }

  function restart() {
    setCounter(init ?? 60);
    setStatus("RUNNING");
  }

  useEffect(() => {
    if (status === "RUNNING") {
      interval = setInterval(countdown, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [status]);

  useEffect(() => {
    if (counter <= 0) {
      clearInterval(interval);
      setStatus("ENDED");
    }
  }, [counter]);

  return { counter, status, start, restart };
}
