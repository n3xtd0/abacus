import { Pressable, Text, View } from 'react-native';

type TimerControlsProps = {
  isCompactLandscape: boolean;
  isRunning: boolean;
  quickAddSeconds: string;
  onAddQuickTime: () => void;
  onReset: () => void;
  onStop: () => void;
  onToggle: () => void;
};

export function TimerControls({
  isCompactLandscape,
  isRunning,
  quickAddSeconds,
  onAddQuickTime,
  onReset,
  onStop,
  onToggle,
}: TimerControlsProps) {
  return (
    <View
      className={
        isCompactLandscape
          ? 'w-[22rem] shrink-0 gap-3'
          : 'mt-auto gap-3 pb-4 md:mt-0 md:w-full md:max-w-xl md:gap-5 md:rounded-2xl md:border md:border-surface-container md:bg-surface-container-lowest md:p-10'
      }
    >
      <View className={isCompactLandscape ? 'flex-row gap-3' : 'flex-row gap-3 md:gap-5'}>
        <Pressable
          className={
            isCompactLandscape
              ? 'h-20 flex-1 items-center justify-center rounded-xl bg-primary active:opacity-80'
              : 'h-20 flex-1 items-center justify-center rounded-xl bg-primary active:opacity-80 md:h-28'
          }
          onPress={onReset}>
          <Text className={isCompactLandscape ? 'text-xl font-bold text-on-primary' : 'text-xl font-bold text-on-primary md:text-2xl'}>↻ Reset</Text>
        </Pressable>
        <Pressable
          className={
            isCompactLandscape
              ? 'h-20 flex-1 items-center justify-center rounded-xl bg-tertiary active:opacity-80'
              : 'h-20 flex-1 items-center justify-center rounded-xl bg-tertiary active:opacity-80 md:h-28'
          }
          onPress={onAddQuickTime}>
          <Text className={isCompactLandscape ? 'text-xl font-bold text-on-tertiary-container' : 'text-xl font-bold text-on-tertiary-container md:text-2xl'}>+{quickAddSeconds || '15'}s</Text>
        </Pressable>
      </View>
      <View className={isCompactLandscape ? 'flex-row gap-3' : 'flex-row gap-3 md:gap-5'}>
        <Pressable
          className={
            isCompactLandscape
              ? 'h-16 flex-1 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-highest active:opacity-80'
              : 'h-16 flex-1 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-highest active:opacity-80 md:h-24'
          }
          onPress={onToggle}>
          <Text className={isCompactLandscape ? 'text-lg font-semibold text-on-surface' : 'text-lg font-semibold text-on-surface md:text-xl'}>
            {isRunning ? 'Ⅱ Pause' : '▶ Start'}
          </Text>
        </Pressable>
        <Pressable
          className={
            isCompactLandscape
              ? 'h-16 flex-1 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-highest active:opacity-80'
              : 'h-16 flex-1 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-highest active:opacity-80 md:h-24'
          }
          onPress={onStop}>
          <Text className={isCompactLandscape ? 'text-lg font-semibold text-on-surface' : 'text-lg font-semibold text-on-surface md:text-xl'}>■ Stop</Text>
        </Pressable>
      </View>
    </View>
  );
}
