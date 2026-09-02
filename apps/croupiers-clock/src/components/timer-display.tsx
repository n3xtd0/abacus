import { View } from 'react-native';

import { URGENT_SECONDS, useTimerAlerts } from '@/hooks/use-timer-alerts';
import { useTimerProgress } from '@/hooks/use-timer-progress';
import { useUrgencyPulse } from '@/hooks/use-urgency-pulse';
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
  useTimerAlerts({ isRunning, remainingSeconds });
  const progress = useTimerProgress({ isRunning, remainingSeconds });
  const urgencyPulse = useUrgencyPulse({ isUrgent: remainingSeconds <= URGENT_SECONDS && isRunning });

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
