import { Text } from 'react-native';
import { colors } from '../theme/tokens';

export default function RatingStars({ value = 0, size = 13 }) {
  const rounded = Math.round(value);
  return (
    <Text style={{ color: colors.gold, fontSize: size, letterSpacing: 1 }}>
      {'★'.repeat(rounded)}{'☆'.repeat(5 - rounded)}
    </Text>
  );
}
