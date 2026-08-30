import { Pressable, Text, TextInput, View } from 'react-native';

type TimerSettingsProps = {
  onSave: () => void;
  onTimerSecondsChange: (value: string) => void;
  timerSeconds: string;
};

export function TimerSettings({
  onSave,
  onTimerSecondsChange,
  timerSeconds,
}: TimerSettingsProps) {
  return (
    <View className="flex-1 justify-center gap-6 px-8 md:mx-auto md:w-full md:max-w-md">
      <Text className="text-center text-2xl font-bold text-on-surface">Timer settings</Text>
      <View className="gap-2">
        <Text className="text-base text-on-surface-variant">Timer duration (seconds)</Text>
        <TextInput
          className="rounded-xl border border-outline-variant bg-surface-container-high px-4 py-3 text-lg text-on-surface"
          keyboardType="number-pad"
          onChangeText={onTimerSecondsChange}
          selectTextOnFocus
          value={timerSeconds}
        />
      </View>
      <Pressable className="mt-5 items-center rounded-xl bg-primary py-4 active:opacity-80" onPress={onSave}>
        <Text className="text-xl font-bold text-on-primary">Save and return</Text>
      </Pressable>
    </View>
  );
}
