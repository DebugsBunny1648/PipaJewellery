import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { colors, fonts, radius, spacing, typeScale } from '../../theme/tokens';

export default function ImageWithText({ section }) {
  return (
    <View style={styles.wrap}>
      {section.imageUrl && <Image source={{ uri: section.imageUrl }} style={styles.image} contentFit="cover" />}
      {section.subtitle && <Text style={styles.eyebrow}>{section.subtitle}</Text>}
      <Text style={styles.title}>{section.title}</Text>
      {section.description && <Text style={styles.desc}>{section.description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg, marginBottom: spacing.xl },
  image: { width: '100%', aspectRatio: 16 / 10, borderRadius: radius.lg, marginBottom: spacing.md, backgroundColor: colors.surfaceSunken },
  eyebrow: { fontFamily: fonts.label, fontSize: 10, letterSpacing: 0.8, color: colors.gold, textTransform: 'uppercase', marginBottom: spacing.xs },
  title: { fontFamily: fonts.display, fontSize: typeScale.xl, color: colors.ink, marginBottom: spacing.xs },
  desc: { fontFamily: fonts.body, fontSize: typeScale.sm, color: colors.inkSoft, lineHeight: 20 }
});
