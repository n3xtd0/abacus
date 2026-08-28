import { View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

type TimerTimeProps = {
  remainingSeconds: number;
  urgencyPulse: SharedValue<number>;
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function TimerTime({ remainingSeconds, urgencyPulse }: TimerTimeProps) {
  const animatedTimeStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(urgencyPulse.value, [0, 1], [1, 1.08]) },
    ],
  }));

  return (
    <View className="items-center">
      <Animated.Text
        className="text-[8rem] font-bold tracking-tighter text-on-surface sm:text-[12rem] md:text-[8rem] lg:text-[12rem] xl:text-[16rem]"
        style={animatedTimeStyle}
      >
        {formatTime(remainingSeconds)}
      </Animated.Text>
    </View>
  );
}
