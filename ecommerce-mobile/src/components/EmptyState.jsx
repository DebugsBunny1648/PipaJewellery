import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';
import { colors, fonts, spacing, typeScale } from '../theme/tokens';

export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {actionLabel && onAction && <Button label={actionLabel} onPress={onAction} style={{ marginTop: spacing.lg }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  title: { fontFamily: fonts.display, fontSize: typeScale.xl, color: colors.ink, marginBottom: spacing.sm, textAlign: 'center' },
  message: { fontFamily: fonts.body, fontSize: typeScale.sm, color: colors.inkSoft, textAlign: 'center' }
});
