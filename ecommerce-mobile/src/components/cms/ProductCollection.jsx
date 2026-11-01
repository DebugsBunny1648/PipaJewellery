import { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { productApi } from '../../api/productApi';
import ProductCard from '../ProductCard';
import { colors, spacing } from '../../theme/tokens';
import SectionHeader from './SectionHeader';

const FETCHERS = {
  featured: productApi.getFeatured,
  'new-arrivals': productApi.getNewArrivals,
  'best-sellers': productApi.getBestSellers
};

function defaultTitle(source) {
  switch (source) {
    case 'new-arrivals': return 'New Arrivals';
    case 'best-sellers': return 'Best Sellers';
    default: return 'Featured Pieces';
  }
}

export default function ProductCollection({ section, source }) {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    const fetcher = FETCHERS[source] || productApi.getFeatured;
    fetcher().then(setProducts).catch(() => setProducts([]));
  }, [source]);

  if (products && products.length === 0) return null;

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <SectionHeader title={section.title || defaultTitle(source)} subtitle={section.subtitle} />
      {!products ? (
        <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.xl }} />
      ) : (
        <FlatList
          data={products}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(p) => String(p.id)}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
          renderItem={({ item }) => <ProductCard product={item} width={168} />}
        />
      )}
    </View>
  );
}
