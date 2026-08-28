import { Pressable, Text, View } from 'react-native';

type TimerControlsProps = {
  isRunning: boolean;
  quickAddSeconds: string;
  onAddQuickTime: () => void;
  onReset: () => void;
  onStop: () => void;
  onToggle: () => void;
};

export function TimerControls({
  isRunning,
  quickAddSeconds,
  onAddQuickTime,
  onReset,
  onStop,
  onToggle,
}: TimerControlsProps) {
  return (
    <View className="mt-auto gap-3 pb-4 md:mt-0 md:w-full md:max-w-md md:rounded-2xl md:border md:border-surface-container md:bg-surface-container-lowest md:p-8">
      <View className="flex-row gap-3">
        <Pressable
          className="h-20 flex-1 items-center justify-center rounded-xl bg-primary active:opacity-80"
          onPress={onReset}>
          <Text className="text-xl font-bold text-on-primary">↻ Reset</Text>
        </Pressable>
        <Pressable
          className="h-20 flex-1 items-center justify-center rounded-xl bg-tertiary active:opacity-80"
          onPress={onAddQuickTime}>
          <Text className="text-xl font-bold text-on-tertiary-container">+{quickAddSeconds || '15'}s</Text>
        </Pressable>
      </View>
      <View className="flex-row gap-3">
        <Pressable
          className="h-16 flex-1 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-highest active:opacity-80"
          onPress={onToggle}>
          <Text className="text-lg font-semibold text-on-surface">
            {isRunning ? 'Ⅱ Pause' : '▶ Start'}
          </Text>
        </Pressable>
        <Pressable
          className="h-16 flex-1 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-highest active:opacity-80"
          onPress={onStop}>
          <Text className="text-lg font-semibold text-on-surface">■ Stop</Text>
        </Pressable>
      </View>
    </View>
  );
}
