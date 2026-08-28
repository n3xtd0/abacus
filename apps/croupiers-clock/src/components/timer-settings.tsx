import { Pressable, Text, TextInput, View } from 'react-native';

type TimerSettingsProps = {
  quickAddSeconds: string;
  standardMinutes: string;
  onQuickAddSecondsChange: (value: string) => void;
  onSave: () => void;
  onStandardMinutesChange: (value: string) => void;
};

export function TimerSettings({
  quickAddSeconds,
  standardMinutes,
  onQuickAddSecondsChange,
  onSave,
  onStandardMinutesChange,
}: TimerSettingsProps) {
  return (
    <View className="flex-1 justify-center gap-6 px-8 md:mx-auto md:w-full md:max-w-md">
      <Text className="text-center text-2xl font-bold text-on-surface">Timer settings</Text>
      <View className="gap-2">
        <Text className="text-base text-on-surface-variant">Standard time (minutes)</Text>
        <TextInput
          className="rounded-xl border border-outline-variant bg-surface-container-high px-4 py-3 text-lg text-on-surface"
          keyboardType="number-pad"
          onChangeText={onStandardMinutesChange}
          selectTextOnFocus
          value={standardMinutes}
        />
      </View>
      <View className="gap-2">
        <Text className="text-base text-on-surface-variant">Quick add time (seconds)</Text>
        <TextInput
          className="rounded-xl border border-outline-variant bg-surface-container-high px-4 py-3 text-lg text-on-surface"
          keyboardType="number-pad"
          onChangeText={onQuickAddSecondsChange}
          selectTextOnFocus
          value={quickAddSeconds}
        />
      </View>
      <Pressable className="mt-5 items-center rounded-xl bg-primary py-4 active:opacity-80" onPress={onSave}>
        <Text className="text-xl font-bold text-on-primary">Save and return</Text>
      </Pressable>
    </View>
  );
}
