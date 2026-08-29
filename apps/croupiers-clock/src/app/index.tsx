import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { TimerControls } from '@/components/timer-controls';
import { TimerDisplay } from '@/components/timer-display';
import { TimerHeader } from '@/components/timer-header';
import { TimerSettings } from '@/components/timer-settings';
import { useTimer } from '@/hooks/use-timer';

export default function HomeScreen() {
  const { height, width } = useWindowDimensions();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [standardMinutes, setStandardMinutes] = useState('25');
  const [quickAddSeconds, setQuickAddSeconds] = useState('15');
  const timer = useTimer();
  const isCompactLandscape = width > height && height < 600;

  const addQuickTime = () => {
    const seconds = Number.parseInt(quickAddSeconds, 10);
    timer.addSeconds(Number.isFinite(seconds) ? seconds : 15);
  };

  const saveSettings = () => {
    const minutes = Number.parseInt(standardMinutes, 10);
    if (Number.isFinite(minutes) && minutes > 0) {
      timer.setMinutes(minutes);
    }
    setIsSettingsOpen(false);
  };

  return (
    <View className="flex-1 bg-background pt-safe">
      <TimerHeader
        isSettingsOpen={isSettingsOpen}
        onToggleSettings={() => setIsSettingsOpen((open) => !open)}
      />

      {isSettingsOpen ? (
        <TimerSettings
          quickAddSeconds={quickAddSeconds}
          standardMinutes={standardMinutes}
          onQuickAddSecondsChange={setQuickAddSeconds}
          onSave={saveSettings}
          onStandardMinutesChange={setStandardMinutes}
        />
      ) : (
        <View
          className={
            isCompactLandscape
              ? 'flex-1 flex-row items-center gap-4 px-5 py-3'
              : 'flex-1 px-5 py-6 md:flex-row md:items-center md:justify-center md:gap-16 md:px-8'
          }
        >
          <TimerDisplay
            isCompactLandscape={isCompactLandscape}
            isRunning={timer.isRunning}
            remainingSeconds={timer.remainingSeconds}
          />
          <TimerControls
            isCompactLandscape={isCompactLandscape}
            isRunning={timer.isRunning}
            quickAddSeconds={quickAddSeconds}
            onAddQuickTime={addQuickTime}
            onReset={timer.reset}
            onStop={timer.stop}
            onToggle={timer.toggle}
          />
        </View>
      )}
    </View>
  );
}
