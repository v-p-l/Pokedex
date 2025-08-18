import { Colors } from '@/constants/Colors';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = ViewProps & {
  backgroundColor:
    | keyof (typeof Colors)['type']
    | (typeof Colors)['light']['tint']
    | (typeof Colors)['dark']['tint'];
};

export function RootView({ backgroundColor, style, ...rest }: Props) {
  /*
    Using `useSafeAreaInsets` instead of a `SafeAreaView` component here is intentional.
  
    `SafeAreaView` applies safe area paddings based on its own layout measurements.
    When it's rendered inside an animated parent (e.g., Reanimated `Animated.View`),
    those layout measurements can be affected by animation timing, especially on iOS.
    This can cause the top inset (status bar / notch padding) to occasionally disappear.
  
    `useSafeAreaInsets` reads the safe area values directly from the SafeAreaProvider context,
    without depending on the layout pass. This ensures consistent and reliable insets,
    even when the component is nested inside animated views.
  */
  const insets = useSafeAreaInsets();

  const colors = useThemeColors();

  const progress = useSharedValue(1);
  const prevColor = useSharedValue(colors.tint);
  const currentColor = useSharedValue(backgroundColor);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [prevColor.value, currentColor.value],
      ),
    };
  });

  useEffect(() => {
    prevColor.value = currentColor.value;
    currentColor.value = backgroundColor;

    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.quad),
      reduceMotion: ReduceMotion.System,
    });
  }, [backgroundColor]);

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      <View
        style={[
          style,
          {
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
        {...rest}
      />
    </Animated.View>
  );
}
