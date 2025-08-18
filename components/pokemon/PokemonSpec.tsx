import { Image, ImageSourcePropType, View, ViewProps, ViewStyle } from 'react-native';
import { Row } from '../Row';
import { ThemedText } from '../ThemedText';

type Props = ViewProps & {
  attributeName?: string;
  value?: string;
  icon?: ImageSourcePropType;
};

export function PokemonSpec({ style, attributeName, value, icon, ...rest }: Props) {
  return (
    <View style={[style, rootStyle]} {...rest}>
      <Row
        style={{
          justifyContent: 'center',
          gap: 8,
          height: 32,
        }}
      >
        {icon && <Image source={icon} style={{ width: 16, height: 16 }} />}
        <ThemedText style={{ textTransform: attributeName === 'Moves' ? 'capitalize' : undefined }}>
          {value}
        </ThemedText>
      </Row>
      <ThemedText variant="caption" color="grayMedium" style={{ alignSelf: 'center' }}>
        {attributeName}
      </ThemedText>
    </View>
  );
}

const rootStyle = {
  flex: 1,
  gap: 4,
} satisfies ViewStyle;
