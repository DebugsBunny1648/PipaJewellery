import { useEffect, useState } from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useRoute } from '@react-navigation/native';
import { pageApi } from '../api/pageApi';
import Screen from '../components/Screen';
import LoadingView from '../components/LoadingView';
import EmptyState from '../components/EmptyState';
import { colors, fonts, radius, spacing, typeScale } from '../theme/tokens';

export default function StaticPageScreen() {
  const route = useRoute();
  const [page, setPage] = useState(undefined);

  useEffect(() => {
    setPage(undefined);
    pageApi.getBySlug(route.params.slug).then(setPage).catch(() => setPage(null));
  }, [route.params.slug]);

  if (page === undefined) return <Screen><LoadingView /></Screen>;
  if (page === null) return <Screen><EmptyState title="Page not found" message="This page hasn't been published yet." /></Screen>;

  return (
    <Screen edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {page.bannerImageUrl && <Image source={{ uri: page.bannerImageUrl }} style={styles.banner} contentFit="cover" />}
        <Text style={styles.title}>{page.title}</Text>
        <Text style={styles.content}>{stripHtml(page.content)}</Text>
      </ScrollView>
    </Screen>
  );
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

const styles = StyleSheet.create({
  banner: { width: '100%', aspectRatio: 16 / 9, borderRadius: radius.lg, marginBottom: spacing.lg, backgroundColor: colors.surfaceSunken },
  title: { fontFamily: fonts.display, fontSize: typeScale.xxl, color: colors.ink, marginBottom: spacing.md },
  content: { fontFamily: fonts.body, fontSize: typeScale.sm, color: colors.inkSoft, lineHeight: 22 }
});
