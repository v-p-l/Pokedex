import { View, ViewProps, ViewStyle } from 'react-native';

type Props = ViewProps & {
  gap?: number;
};

export function Row({ gap, style, ...rest }: Props) {
  return <View style={[rowStyle, style, gap ? { gap: gap } : undefined]} {...rest} />;
}

const rowStyle = {
  flex: 0,
  flexDirection: 'row',
  alignItems: 'center',
} satisfies ViewStyle;
