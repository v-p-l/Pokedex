import { useThemeColors } from '@/hooks/useThemeColors';
import { Image, StyleSheet, TextInput } from 'react-native';
import { Row } from './Row';

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
  const colors = useThemeColors();

  return (
    <Row gap={8} style={[styles.wrapper, { backgroundColor: colors.grayWhite }]}>
      <Image source={require('@/assets/images/icon-search.png')} style={styles.searchIcon} />
      <TextInput
        placeholder="Search a pokemon..."
        value={value}
        onChangeText={onChange}
        placeholderTextColor={colors.grayMedium}
        style={[styles.input]}
      />
    </Row>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 16,
  },
  searchIcon: {
    width: 16,
    height: 16,
  },
  input: {
    flex: 1,
  },
});
