import { Text, View } from 'react-native';

type TimerDisplayProps = {
  remainingSeconds: number;
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function TimerDisplay({ remainingSeconds }: TimerDisplayProps) {
  return (
    <View className="flex-1 items-center justify-center md:max-w-xl">
      <View className="h-72 w-72 items-center justify-center rounded-full border-8 border-surface-container-high md:h-96 md:w-96">
        <View className="-rotate-45 absolute h-72 w-72 rounded-full border-8 border-b-primary border-r-primary border-t-primary border-l-transparent md:h-96 md:w-96" />
        <View className="items-center">
          <Text className="text-6xl font-bold tracking-tighter text-on-surface md:text-8xl">
            {formatTime(remainingSeconds)}
          </Text>
          <Text className="mt-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Focus session
          </Text>
        </View>
      </View>
    </View>
  );
}
