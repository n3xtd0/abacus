import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { TimerProgressRing } from './timer-progress-ring';
import { TimerTime } from './timer-time';

type TimerDisplayProps = {
  isCompactLandscape: boolean;
  isRunning: boolean;
  remainingSeconds: number;
};

export function TimerDisplay({
  isCompactLandscape,
  isRunning,
  remainingSeconds,
}: TimerDisplayProps) {
  const progress = useSharedValue(0);
  const urgencyPulse = useSharedValue(0);
  const previousIsUrgent = useRef(false);
  const previousIsRunning = useRef(isRunning);
  const previousRemainingSeconds = useRef(remainingSeconds);
  const isUrgent = isRunning && remainingSeconds > 0 && remainingSeconds <= 3;

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

  useEffect(() => {
    if (isUrgent && !previousIsUrgent.current) {
      urgencyPulse.value = withRepeat(
        withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    } else if (!isUrgent) {
      cancelAnimation(urgencyPulse);
      urgencyPulse.value = 0;
    }

    previousIsUrgent.current = isUrgent;
  }, [isUrgent, urgencyPulse]);

  return (
    <View className="flex-1 items-center justify-center">
      {isCompactLandscape ? (
        <View className="w-full items-center gap-4">
          <TimerTime
            remainingSeconds={remainingSeconds}
            urgencyPulse={urgencyPulse}
          />
          <TimerProgressRing
            isLinear
            progress={progress}
            urgencyPulse={urgencyPulse}
          />
        </View>
      ) : (
        <View className="aspect-square w-full items-center justify-center md:max-w-3xl">
          <TimerProgressRing progress={progress} urgencyPulse={urgencyPulse} />
          <TimerTime
            remainingSeconds={remainingSeconds}
            urgencyPulse={urgencyPulse}
          />
        </View>
      )}
    </View>
  );
}
