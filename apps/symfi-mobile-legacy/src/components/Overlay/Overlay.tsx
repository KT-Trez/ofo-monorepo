import { type DimensionValue, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

type OverlayProps = {
  bottom?: DimensionValue;
  left?: DimensionValue;
  right?: DimensionValue;
  text: string;
  top?: DimensionValue;
};

export const Overlay = ({ bottom, left, right, text, top }: OverlayProps) => (
  <Text style={[styles.overlay, { bottom, left, right, top }]} variant="labelSmall">
    {text}
  </Text>
);

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderColor: 'rgba(230, 230, 230, 0.4)',
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    color: '#fff',
    fontWeight: 'bold',
    padding: 4,
    position: 'absolute',
    textAlign: 'center',
  },
});
