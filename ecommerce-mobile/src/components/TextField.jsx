import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, fonts, radius, spacing, typeScale } from '../theme/tokens';

export default function TextField({ label, error, style, ...inputProps }) {
  return (
    <View style={[styles.field, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={colors.inkFaint}
        {...inputProps}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.md },
  label: { fontFamily: fonts.bodyMedium, fontSize: typeScale.sm, color: colors.inkSoft, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    fontFamily: fonts.body, fontSize: typeScale.base, color: colors.ink, backgroundColor: colors.surface
  },
  inputError: { borderColor: colors.danger },
  error: { fontFamily: fonts.body, fontSize: typeScale.xs, color: colors.danger, marginTop: 4 }
});
