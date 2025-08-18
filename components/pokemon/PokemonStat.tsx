import { useThemeColors } from '@/hooks/useThemeColors';
import { useEffect } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Row } from '../Row';
import { ThemedText } from '../ThemedText';

type Props = ViewProps & {
  name: string;
  value: number;
  color: string;
};

export function PokemonStat({ name, value, color, style, ...rest }: Props) {
  const colors = useThemeColors();
  const sharedValue = useSharedValue(value);
  const barInnerStyle = useAnimatedStyle(() => {
    return {
      flex: sharedValue.value,
    };
  });
  const barBackgroundStyle = useAnimatedStyle(() => {
    return {
      flex: 255 - sharedValue.value,
    };
  });

  useEffect(() => {
    sharedValue.value = withSpring(value);
  }, [value]);

  return (
    <Row style={[style, { gap: 8 }]} {...rest}>
      <View style={[styles.name, { borderColor: colors.grayLight }]}>
        <ThemedText variant="subtitle3" style={{ width: 28, textAlign: 'right', color: color }}>
          {name}
        </ThemedText>
      </View>
      <View style={[styles.value]}>
        <ThemedText style={{ width: 20 }}>{value.toString().padStart(3, '0')}</ThemedText>
      </View>
      <Row style={styles.bar}>
        <Animated.View style={[styles.barInner, { backgroundColor: color }, barInnerStyle]} />
        <Animated.View
          style={[styles.barBackground, { backgroundColor: color }, barBackgroundStyle]}
        />
      </Row>
    </Row>
  );
}

const styles = StyleSheet.create({
  name: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderStyle: 'solid',
  },
  value: {
    paddingLeft: 4,
  },
  bar: {
    flex: 1,
    borderRadius: 20,
    height: 4,
    overflow: 'hidden',
  },
  barInner: {
    height: 4,
  },
  barBackground: {
    height: 4,
    opacity: 0.24,
  },
});
