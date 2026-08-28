import { Pressable, Text, View } from 'react-native';

type TimerHeaderProps = {
  isSettingsOpen: boolean;
  onToggleSettings: () => void;
};

export function TimerHeader({ isSettingsOpen, onToggleSettings }: TimerHeaderProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-outline-variant/30 px-5 py-3">
      <Pressable
        accessibilityLabel="Open menu"
        className="h-10 w-10 items-center justify-center rounded-full active:bg-surface-variant">
        <Text className="text-2xl text-primary-fixed-dim">☰</Text>
      </Pressable>
      <Text className="text-2xl font-bold text-primary-fixed-dim">Time Bank</Text>
      <Pressable
        accessibilityLabel={isSettingsOpen ? 'Return to timer' : 'Open settings'}
        className="h-10 w-10 items-center justify-center rounded-full active:bg-surface-variant"
        onPress={onToggleSettings}>
        <Text className="text-2xl text-primary-fixed-dim">{isSettingsOpen ? '◷' : '⚙'}</Text>
      </Pressable>
    </View>
  );
}
