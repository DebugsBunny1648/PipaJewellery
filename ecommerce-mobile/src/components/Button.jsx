import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, fonts, radius, spacing, typeScale } from '../theme/tokens';

const VARIANTS = {
  primary: { bg: colors.primary, bgPressed: colors.primaryDark, text: '#fff', border: 'transparent' },
  outline: { bg: 'transparent', bgPressed: colors.surfaceSunken, text: colors.ink, border: colors.ink },
  danger: { bg: colors.danger, bgPressed: '#832C21', text: '#fff', border: 'transparent' },
  ghost: { bg: 'transparent', bgPressed: colors.surfaceSunken, text: colors.inkSoft, border: 'transparent' }
};

export default function Button({ label, onPress, variant = 'primary', loading = false, disabled = false, style, small = false }) {
  const v = VARIANTS[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        small && styles.small,
        { backgroundColor: pressed ? v.bgPressed : v.bg, borderColor: v.border, borderWidth: variant === 'outline' ? 1 : 0 },
        (disabled || loading) && styles.disabled,
        style
      ]}
    >
      {loading ? <ActivityIndicator color={v.text} /> : <Text style={[styles.label, { color: v.text }, small && styles.smallLabel]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  small: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  label: { fontFamily: fonts.bodySemibold, fontSize: typeScale.base },
  smallLabel: { fontSize: typeScale.sm },
  disabled: { opacity: 0.5 }
});
