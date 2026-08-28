import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

type TimerDisplayProps = {
  isRunning: boolean;
  remainingSeconds: number;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const RING_STROKE_WIDTH = 8;
const URGENT_RING_STROKE_WIDTH = 14;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function TimerDisplay({ isRunning, remainingSeconds }: TimerDisplayProps) {
  const [ringSize, setRingSize] = useState(288);
  const progress = useSharedValue(0);
  const urgencyPulse = useSharedValue(0);
  const previousIsUrgent = useRef(false);
  const previousIsRunning = useRef(isRunning);
  const previousRemainingSeconds = useRef(remainingSeconds);
  const center = ringSize / 2;
  const radius = center - URGENT_RING_STROKE_WIDTH / 2;
  const circumference = 2 * Math.PI * radius;
  const isUrgent = isRunning && remainingSeconds > 0 && remainingSeconds <= 3;

  useEffect(() => {
    const wasReset = remainingSeconds > previousRemainingSeconds.current;
    previousRemainingSeconds.current = remainingSeconds;
    const didStart = isRunning && !previousIsRunning.current;
    previousIsRunning.current = isRunning;

    if (remainingSeconds === 0) {
      cancelAnimation(progress);
      progress.value = 1;
      return;
    }

    if (wasReset) {
      cancelAnimation(progress);
      progress.value = 0;
    }

    if (!isRunning) {
      cancelAnimation(progress);
      return;
    }

    if (didStart || wasReset) {
      progress.value = withTiming(1, {
        duration: remainingSeconds * 1000,
        easing: Easing.linear,
      });
    }
  }, [isRunning, progress, remainingSeconds]);

  useEffect(() => {
    if (isUrgent && !previousIsUrgent.current) {
      urgencyPulse.value = withRepeat(
        withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    } else if (!isUrgent) {
      cancelAnimation(urgencyPulse);
      urgencyPulse.value = 0;
    }

    previousIsUrgent.current = isUrgent;
  }, [isUrgent, urgencyPulse]);

  const animatedRingProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
    strokeWidth: interpolate(
      urgencyPulse.value,
      [0, 1],
      [RING_STROKE_WIDTH, URGENT_RING_STROKE_WIDTH],
    ),
  }));
  const animatedTimeStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(urgencyPulse.value, [0, 1], [1, 1.08]) },
    ],
  }));

  return (
    <View className="flex-1 items-center justify-center md:max-w-xl">
      <View
        className="h-72 w-72 items-center justify-center md:h-96 md:w-96"
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
        <View className="items-center">
          <Animated.Text
            className="text-6xl font-bold tracking-tighter text-on-surface md:text-8xl"
            style={animatedTimeStyle}
          >
            {formatTime(remainingSeconds)}
          </Animated.Text>
          <Text className="mt-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Focus session
          </Text>
        </View>
      </View>
    </View>
  );
}
