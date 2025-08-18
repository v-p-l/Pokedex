import { Colors } from '@/constants/Colors';
import { useThemeColors } from '@/hooks/useThemeColors';
import { View, ViewStyle } from 'react-native';
import { ThemedText } from '../ThemedText';

type Props = {
  name: keyof (typeof Colors)['type'] | '--';
};

export function PokemonType({ name }: Props) {
  const colors = useThemeColors();
  return (
    <View
      style={[rootStyle, { backgroundColor: name === '--' ? colors.grayLight : Colors.type[name] }]}
    >
      <ThemedText color="grayWhite" variant="subtitle3" style={{ textTransform: 'capitalize' }}>
        {name}
      </ThemedText>
    </View>
  );
}

const rootStyle = {
  flex: 0,
  paddingVertical: 2,
  paddingHorizontal: 8,
  borderRadius: 8,
} satisfies ViewStyle;
