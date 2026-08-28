import { useEffect, useState } from 'react';

const DEFAULT_SECONDS = 15;

export function useTimer() {
  const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_SECONDS);
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
    setRemainingSeconds(DEFAULT_SECONDS);
  };

  const stop = () => setIsRunning(false);

  const toggle = () => setIsRunning((running) => !running);

  const addSeconds = (seconds: number) => {
    setRemainingSeconds((current) => current + seconds);
  };

  const setMinutes = (minutes: number) => {
    setRemainingSeconds(minutes * 60);
    setIsRunning(false);
  };

  return {
    addSeconds,
    isRunning,
    remainingSeconds,
    reset,
    setMinutes,
    stop,
    toggle,
  };
}
