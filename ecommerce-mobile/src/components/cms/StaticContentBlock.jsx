import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, typeScale } from '../../theme/tokens';

export default function StaticContentBlock({ section }) {
  if (!section.title && !section.description) return null;
  return (
    <View style={styles.wrap}>
      {section.title && <Text style={styles.title}>{section.title}</Text>}
      {section.description && <Text style={styles.desc}>{section.description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg, marginBottom: spacing.xl, alignItems: 'center' },
  title: { fontFamily: fonts.display, fontSize: typeScale.lg, color: colors.ink, textAlign: 'center', marginBottom: spacing.xs },
  desc: { fontFamily: fonts.body, fontSize: typeScale.sm, color: colors.inkSoft, textAlign: 'center' }
});
