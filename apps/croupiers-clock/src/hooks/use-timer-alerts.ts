import { useEffect, useRef } from 'react';
import { useAudioPlayer } from 'expo-audio';

type UseTimerAlertsOptions = {
  isRunning: boolean;
  remainingSeconds: number;
};

export function useTimerAlerts({
  isRunning,
  remainingSeconds,
}: UseTimerAlertsOptions) {
  const countdownAlert = useAudioPlayer(
    require('@/assets/sounds/pokerstars_time.mp3'),
  );
  const timerFinishedAlert = useAudioPlayer(
    require('@/assets/sounds/timer-finished.wav'),
  );
  const hasPlayedCountdownAlert = useRef(false);
  const hasPlayedTimerFinishedAlert = useRef(false);

  useEffect(() => {
    if (!isRunning || remainingSeconds > 3) {
      hasPlayedCountdownAlert.current = false;
      return;
    }

    if (remainingSeconds === 3 && !hasPlayedCountdownAlert.current) {
      countdownAlert.seekTo(0);
      countdownAlert.play();
      hasPlayedCountdownAlert.current = true;
    }
  }, [countdownAlert, isRunning, remainingSeconds]);

  useEffect(() => {
    if (remainingSeconds > 0) {
      hasPlayedTimerFinishedAlert.current = false;
      return;
    }

    if (isRunning && !hasPlayedTimerFinishedAlert.current) {
      timerFinishedAlert.seekTo(0);
      timerFinishedAlert.play();
      hasPlayedTimerFinishedAlert.current = true;
    }
  }, [isRunning, remainingSeconds, timerFinishedAlert]);
}
