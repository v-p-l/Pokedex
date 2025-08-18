import { Shadows } from '@/constants/Shadows';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRef, useState } from 'react';
import { Dimensions, Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import { Card } from './Card';
import { Radio } from './Radio';
import { Row } from './Row';
import { ThemedText } from './ThemedText';

type Props = {
  value: 'id' | 'name';
  onChange: (value: 'id' | 'name') => void;
};

const options = [
  { label: 'Number', value: 'id' },
  { label: 'Name', value: 'name' },
] as const;

export function SortButton({ value, onChange }: Props) {
  const colors = useThemeColors();

  const buttonRef = useRef<View>(null);
  const [position, setPosition] = useState<null | { top: number; right: number }>(null);

  const [isModalVisible, setModalVisibility] = useState(false);
  const onButtonPress = () => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      setPosition({
        top: y + height,
        right: Dimensions.get('window').width - x - width,
      });
      setModalVisibility(true);
    });
  };
  const onClose = () => {
    setModalVisibility(false);
  };

  return (
    <>
      <Pressable onPress={onButtonPress}>
        <View ref={buttonRef} style={[styles.button, { backgroundColor: colors.grayWhite }]}>
          <Image
            source={
              value === 'id'
                ? require('@/assets/images/icon-tag.png')
                : require('@/assets/images/icon-alpha.png')
            }
            style={[styles.icon]}
          />
        </View>
      </Pressable>
      <Modal animationType="fade" transparent visible={isModalVisible} onRequestClose={onClose}>
        <Pressable onPress={onClose} style={[styles.backdrop]} />
        <View style={[styles.popup, { backgroundColor: colors.tint, ...position }]}>
          <ThemedText variant="subtitle2" color="grayWhite" style={styles.title}>
            Sort by:
          </ThemedText>
          <Card style={styles.card}>
            {options.map((option) => (
              <Pressable onPress={() => onChange(option.value)} key={option.value}>
                <Row gap={8}>
                  <Radio checked={option.value === value} />
                  <ThemedText>{option.label}</ThemedText>
                </Row>
              </Pressable>
            ))}
          </Card>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: 32,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  popup: {
    position: 'absolute',
    width: 113,
    padding: 4,
    paddingTop: 16,
    gap: 16,
    borderRadius: 12,
    ...Shadows.dp2,
  },
  title: {
    paddingLeft: 20,
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
});
