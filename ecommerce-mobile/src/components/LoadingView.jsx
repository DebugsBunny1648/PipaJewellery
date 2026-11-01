import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, fonts, spacing, typeScale } from '../theme/tokens';

export default function LoadingView({ label = 'Loading…' }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  label: { fontFamily: fonts.body, color: colors.inkSoft, fontSize: typeScale.sm, marginTop: spacing.sm }
});
