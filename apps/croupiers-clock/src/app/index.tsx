import { useState } from 'react';
import { View } from 'react-native';

import { TimerControls } from '@/components/timer-controls';
import { TimerDisplay } from '@/components/timer-display';
import { TimerHeader } from '@/components/timer-header';
import { TimerSettings } from '@/components/timer-settings';
import { useTimer } from '@/hooks/use-timer';

export default function HomeScreen() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [standardMinutes, setStandardMinutes] = useState('25');
  const [quickAddSeconds, setQuickAddSeconds] = useState('15');
  const timer = useTimer();

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
        <View className="flex-1 px-5 py-6 md:flex-row md:items-center md:justify-center md:gap-16 md:px-8">
          <TimerDisplay
            isRunning={timer.isRunning}
            remainingSeconds={timer.remainingSeconds}
          />
          <TimerControls
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
