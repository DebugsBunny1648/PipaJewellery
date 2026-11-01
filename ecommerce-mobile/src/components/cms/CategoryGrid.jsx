import { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { categoryApi } from '../../api/categoryApi';
import { colors, fonts, spacing, typeScale } from '../../theme/tokens';
import SectionHeader from './SectionHeader';

export default function CategoryGrid({ section }) {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);

  useEffect(() => { categoryApi.getTree().then(setCategories).catch(() => setCategories([])); }, []);
  if (!categories.length) return null;

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <SectionHeader title={section.title || 'Shop by Category'} subtitle={section.subtitle} />
      <FlatList
        data={categories.slice(0, 8)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(c) => String(c.id)}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => navigation.navigate('Shop', { categorySlug: item.slug, categoryName: item.name })}>
            <View style={styles.circle}>
              {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.circleImg} contentFit="cover" /> : null}
            </View>
            <Text style={styles.label} numberOfLines={1}>{item.name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: { alignItems: 'center', width: 84 },
  circle: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.surfaceSunken, overflow: 'hidden', marginBottom: spacing.xs },
  circleImg: { width: '100%', height: '100%' },
  label: { fontFamily: fonts.bodyMedium, fontSize: typeScale.xs, color: colors.ink, textAlign: 'center' }
});
