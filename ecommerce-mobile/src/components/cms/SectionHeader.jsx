import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, typeScale } from '../../theme/tokens';

export default function SectionHeader({ title, subtitle }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  title: { fontFamily: fonts.display, fontSize: typeScale.xl, color: colors.ink },
  subtitle: { fontFamily: fonts.body, fontSize: typeScale.sm, color: colors.inkSoft, marginTop: 2 }
});
