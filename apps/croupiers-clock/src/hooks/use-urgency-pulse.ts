import { useEffect, useRef } from 'react';
import {
  cancelAnimation,
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type UseUrgencyPulseOptions = {
  isUrgent: boolean;
};

export function useUrgencyPulse({
  isUrgent,
}: UseUrgencyPulseOptions) {
  const urgencyPulse = useSharedValue(0);
  const previousIsUrgent = useRef(false);

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

  return urgencyPulse;
}
