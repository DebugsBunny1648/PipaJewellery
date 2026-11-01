import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts, radius, spacing, typeScale, shadow } from '../../theme/tokens';

export default function HeroBanner({ section }) {
  const navigation = useNavigation();
  return (
    <View style={[styles.wrap, { backgroundColor: section.backgroundColor || colors.primary }]}>
      {section.imageUrl && (
        <Image source={{ uri: section.imageUrl }} style={styles.image} contentFit="cover" transition={300} />
      )}
      <View style={styles.overlay}>
        {section.subtitle && <Text style={styles.eyebrow}>{section.subtitle}</Text>}
        <Text style={[styles.title, { color: section.textColor || '#fff' }]}>{section.title}</Text>
        {section.description && <Text style={[styles.desc, { color: section.textColor || '#fff' }]}>{section.description}</Text>}
        {section.ctaText && (
          <Pressable style={styles.cta} onPress={() => navigation.navigate('Shop')}>
            <Text style={styles.ctaLabel}>{section.ctaText}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { margin: spacing.lg, borderRadius: radius.lg, overflow: 'hidden', minHeight: 340, ...shadow.card },
  image: { ...StyleSheet.absoluteFillObject },
  overlay: { flex: 1, padding: spacing.xl, justifyContent: 'flex-end', backgroundColor: 'rgba(10,43,34,0.35)' },
  eyebrow: { fontFamily: fonts.label, fontSize: 11, letterSpacing: 1, color: colors.gold, textTransform: 'uppercase', marginBottom: spacing.sm },
  title: { fontFamily: fonts.displaySemibold, fontSize: typeScale.xxl, marginBottom: spacing.sm },
  desc: { fontFamily: fonts.body, fontSize: typeScale.sm, opacity: 0.9, marginBottom: spacing.lg },
  cta: { backgroundColor: colors.gold, alignSelf: 'flex-start', paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.sm },
  ctaLabel: { fontFamily: fonts.bodySemibold, fontSize: typeScale.sm, color: '#fff' }
});
