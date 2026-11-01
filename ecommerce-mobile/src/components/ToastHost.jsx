import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { dismissToast } from '../store/slices/uiSlice';
import { colors, fonts, radius, spacing, typeScale } from '../theme/tokens';

export default function ToastHost() {
  const toasts = useSelector((s) => s.ui.toasts);
  const dispatch = useDispatch();
  if (!toasts.length) return null;

  return (
    <View style={styles.stack} pointerEvents="box-none">
      {toasts.map((t) => (
        <Pressable
          key={t.id}
          style={[styles.toast, t.tone === 'error' && styles.error, t.tone === 'success' && styles.success]}
          onPress={() => dispatch(dismissToast(t.id))}
        >
          <Text style={styles.label}>{t.message}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { position: 'absolute', bottom: spacing.xxl, left: spacing.lg, right: spacing.lg, gap: spacing.sm },
  toast: { backgroundColor: colors.ink, padding: spacing.md, borderRadius: radius.sm },
  error: { backgroundColor: colors.danger },
  success: { backgroundColor: colors.primary },
  label: { color: '#fff', fontFamily: fonts.bodyMedium, fontSize: typeScale.sm, textAlign: 'center' }
});
