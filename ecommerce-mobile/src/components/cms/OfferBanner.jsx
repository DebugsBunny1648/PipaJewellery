import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts, radius, spacing, typeScale } from '../../theme/tokens';

export default function OfferBanner({ section }) {
  const navigation = useNavigation();
  return (
    <View style={[styles.wrap, { backgroundColor: section.backgroundColor || colors.blush }]}>
      {section.subtitle && <Text style={styles.eyebrow}>{section.subtitle}</Text>}
      <Text style={[styles.title, { color: section.textColor || colors.ink }]}>{section.title}</Text>
      {section.description && <Text style={[styles.desc, { color: section.textColor || colors.inkSoft }]}>{section.description}</Text>}
      {section.ctaText && (
        <Pressable style={styles.cta} onPress={() => navigation.navigate('Shop')}>
          <Text style={styles.ctaLabel}>{section.ctaText}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: spacing.lg, marginBottom: spacing.lg, padding: spacing.xl, borderRadius: radius.lg },
  eyebrow: { fontFamily: fonts.label, fontSize: 10, letterSpacing: 0.8, color: colors.gold, textTransform: 'uppercase', marginBottom: spacing.xs },
  title: { fontFamily: fonts.display, fontSize: typeScale.xl, marginBottom: spacing.xs },
  desc: { fontFamily: fonts.body, fontSize: typeScale.sm, marginBottom: spacing.md },
  cta: { backgroundColor: colors.primary, alignSelf: 'flex-start', paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.sm },
  ctaLabel: { fontFamily: fonts.bodySemibold, fontSize: typeScale.sm, color: '#fff' }
});
