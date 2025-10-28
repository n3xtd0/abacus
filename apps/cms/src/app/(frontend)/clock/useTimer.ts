import { useEffect, useState } from "react";

export default function useTimer(startingMinutes: number, isPaused: boolean) {
  const [secs, setSecs] = useState(59);
  const [mins, setMins] = useState(startingMinutes - 1);

  useEffect(() => {
    if (isPaused) return;

    const intervalId = setInterval(() => {
      setSecs(secs - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secs, isPaused]);

  useEffect(() => {
    if (secs === -1) {
      setMins((prev) => prev - 1);
      setSecs(59);
    }
  }, [secs]);

  useEffect(()=>{
    setSecs(59)
  },[mins])

  return { secs, mins, setMins, setSecs };
}
