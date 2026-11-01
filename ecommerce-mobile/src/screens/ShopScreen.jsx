import { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import LoadingView from '../components/LoadingView';
import Screen from '../components/Screen';
import { colors, fonts, radius, spacing, typeScale } from '../theme/tokens';

export default function ShopScreen() {
  const route = useRoute();
  const { categorySlug, categoryName, searchQuery } = route.params || {};

  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [keyword, setKeyword] = useState(searchQuery || '');
  const [result, setResult] = useState(null);

  useEffect(() => { categoryApi.getTree().then(setCategories).catch(() => setCategories([])); }, []);

  useEffect(() => {
    if (categorySlug && categories.length) {
      const match = categories.find((c) => c.slug === categorySlug);
      setActiveCategoryId(match?.id ?? null);
    }
  }, [categorySlug, categories]);

  useEffect(() => {
    setResult(null);
    productApi.search({ keyword: keyword || undefined, categoryId: activeCategoryId || undefined, sortBy: 'newest', page: 0, size: 20 })
      .then(setResult)
      .catch(() => setResult({ content: [] }));
  }, [keyword, activeCategoryId]);

  return (
    <Screen edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{categoryName || 'All Jewellery'}</Text>
        <TextInput
          style={styles.search}
          placeholder="Search jewellery…"
          placeholderTextColor={colors.inkFaint}
          value={keyword}
          onChangeText={setKeyword}
        />
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[{ id: null, name: 'All' }, ...categories]}
        keyExtractor={(c) => String(c.id)}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.md }}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.chip, activeCategoryId === item.id && styles.chipActive]}
            onPress={() => setActiveCategoryId(item.id)}
          >
            <Text style={[styles.chipLabel, activeCategoryId === item.id && styles.chipLabelActive]}>{item.name}</Text>
          </Pressable>
        )}
      />

      {!result ? (
        <LoadingView label="Finding pieces…" />
      ) : result.content.length === 0 ? (
        <EmptyState title="No pieces found" message="Try a different search or category." />
      ) : (
        <FlatList
          data={result.content}
          keyExtractor={(p) => String(p.id)}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: spacing.lg }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  title: { fontFamily: fonts.display, fontSize: typeScale.xxl, color: colors.ink, marginBottom: spacing.md },
  search: { backgroundColor: colors.surfaceSunken, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, fontFamily: fonts.body, fontSize: typeScale.sm },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: radius.pill, backgroundColor: colors.surfaceSunken },
  chipActive: { backgroundColor: colors.primary },
  chipLabel: { fontFamily: fonts.bodyMedium, fontSize: typeScale.xs, color: colors.inkSoft },
  chipLabelActive: { color: '#fff' }
});
