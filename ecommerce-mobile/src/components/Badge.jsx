import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radius } from '../theme/tokens';

const TONES = {
  gold: { bg: colors.goldSoft, text: '#6B4E20' },
  emerald: { bg: colors.primaryTint, text: colors.primaryDark },
  danger: { bg: colors.dangerTint, text: colors.danger },
  success: { bg: colors.successTint, text: colors.success },
  warning: { bg: colors.warningTint, text: colors.warning }
};

export default function Badge({ label, tone = 'gold' }) {
  const t = TONES[tone] || TONES.gold;
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Text style={[styles.label, { color: t.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: radius.pill, alignSelf: 'flex-start' },
  label: { fontFamily: fonts.label, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase' }
});
