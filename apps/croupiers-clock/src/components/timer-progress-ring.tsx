import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

type TimerProgressRingProps = {
  isLinear?: boolean;
  progress: SharedValue<number>;
  urgencyPulse: SharedValue<number>;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const RING_STROKE_WIDTH = 8;
const URGENT_RING_STROKE_WIDTH = 14;

export function TimerProgressRing({
  isLinear = false,
  progress,
  urgencyPulse,
}: TimerProgressRingProps) {
  const [ringSize, setRingSize] = useState(288);
  const center = ringSize / 2;
  const radius = center - URGENT_RING_STROKE_WIDTH / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedRingProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
    strokeWidth: interpolate(
      urgencyPulse.value,
      [0, 1],
      [RING_STROKE_WIDTH, URGENT_RING_STROKE_WIDTH],
    ),
  }));

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  if (isLinear) {
    return (
      <View className="h-4 w-full max-w-sm overflow-hidden rounded-full bg-surface-container-high">
        <Animated.View
          className="h-full rounded-full bg-primary"
          style={animatedProgressStyle}
        />
      </View>
    );
  }

  return (
    <View
      className="absolute inset-0"
      onLayout={({ nativeEvent }) => setRingSize(nativeEvent.layout.width)}
    >
      <Svg
        height={ringSize}
        style={StyleSheet.absoluteFill}
        width={ringSize}
        viewBox={`0 0 ${ringSize} ${ringSize}`}
      >
        <Circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke="#242c24"
          strokeWidth={RING_STROKE_WIDTH}
        />
        <AnimatedCircle
          animatedProps={animatedRingProps}
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke="#4be277"
          strokeDasharray={circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
    </View>
  );
}
