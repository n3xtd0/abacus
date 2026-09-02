import { useEffect, useRef } from 'react';
import {
  cancelAnimation,
  Easing,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type UseTimerProgressOptions = {
  isRunning: boolean;
  remainingSeconds: number;
};

export function useTimerProgress({
  isRunning,
  remainingSeconds,
}: UseTimerProgressOptions) {
  const progress = useSharedValue(0);
  const previousIsRunning = useRef(isRunning);
  const previousRemainingSeconds = useRef(remainingSeconds);

  useEffect(() => {
    const wasReset = remainingSeconds > previousRemainingSeconds.current;
    previousRemainingSeconds.current = remainingSeconds;
    const didStart = isRunning && !previousIsRunning.current;
    previousIsRunning.current = isRunning;

    if (remainingSeconds === 0) {
      cancelAnimation(progress);
      progress.value = 1;
      return;
    }

    if (wasReset) {
      cancelAnimation(progress);
      progress.value = 0;
    }

    if (!isRunning) {
      cancelAnimation(progress);
      return;
    }

    if (didStart || wasReset) {
      progress.value = withTiming(1, {
        duration: remainingSeconds * 1000,
        easing: Easing.linear,
      });
    }
  }, [isRunning, progress, remainingSeconds]);

  return progress;
}
