import { useEffect, useState } from 'react';
import { FlatList, View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { orderApi } from '../../api/orderApi';
import Screen from '../../components/Screen';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';
import LoadingView from '../../components/LoadingView';
import { colors, fonts, radius, spacing, typeScale } from '../../theme/tokens';
import { formatCurrency, formatDate } from '../../utils/format';

export default function OrdersScreen() {
  const navigation = useNavigation();
  const [result, setResult] = useState(null);

  useEffect(() => { orderApi.getMyOrders().then(setResult).catch(() => setResult({ content: [] })); }, []);

  if (!result) return <Screen><LoadingView label="Loading orders…" /></Screen>;
  if (result.content.length === 0) {
    return <Screen><EmptyState title="No orders yet" message="Once you place an order it'll show up here." actionLabel="Start shopping" onAction={() => navigation.navigate('Shop')} /></Screen>;
  }

  return (
    <Screen edges={['top']}>
      <Text style={styles.title}>Your Orders</Text>
      <FlatList
        data={result.content}
        keyExtractor={(o) => String(o.id)}
        contentContainerStyle={{ paddingHorizontal: spacing.lg }}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => navigation.navigate('OrderDetail', { id: item.id })}>
            <View style={{ flex: 1 }}>
              <Text style={styles.orderNumber}>{item.orderNumber}</Text>
              <Text style={styles.meta}>{formatDate(item.createdAt)} · {item.items.length} item{item.items.length > 1 ? 's' : ''}</Text>
            </View>
            <Badge label={item.status} tone="emerald" />
            <Text style={styles.total}>{formatCurrency(item.totalAmount)}</Text>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: typeScale.xxl, color: colors.ink, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.line },
  orderNumber: { fontFamily: fonts.bodySemibold, fontSize: typeScale.sm, color: colors.ink },
  meta: { fontFamily: fonts.body, fontSize: typeScale.xs, color: colors.inkSoft, marginTop: 2 },
  total: { fontFamily: fonts.label, fontSize: typeScale.sm, color: colors.ink }
});
