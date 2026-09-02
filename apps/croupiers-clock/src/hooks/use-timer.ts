import { useEffect, useState } from 'react';

export const DEFAULT_SECONDS = 30;

export function useTimer() {
  const [durationSeconds, setConfiguredDurationSeconds] = useState(DEFAULT_SECONDS);
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || remainingSeconds === 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, remainingSeconds]);

  useEffect(() => {
    if (remainingSeconds === 0) setIsRunning(false);
  }, [remainingSeconds]);

  const reset = () => {
    setRemainingSeconds(durationSeconds);
    setIsRunning(true);
  };

  const stop = () => setIsRunning(false);

  const toggle = () => setIsRunning((running) => !running);

  const addSeconds = (seconds: number) => {
    setRemainingSeconds((current) => current + seconds);
  };

  const setDurationSeconds = (seconds: number) => {
    setConfiguredDurationSeconds(seconds);
    setRemainingSeconds(seconds);
    setIsRunning(false);
  };

  return {
    addSeconds,
    isRunning,
    remainingSeconds,
    reset,
    setDurationSeconds,
    stop,
    toggle,
  };
}
