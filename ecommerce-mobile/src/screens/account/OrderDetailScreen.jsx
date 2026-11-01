import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { orderApi } from '../../api/orderApi';
import { showToast } from '../../store/slices/uiSlice';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import LoadingView from '../../components/LoadingView';
import { colors, fonts, radius, spacing, typeScale } from '../../theme/tokens';
import { formatCurrency, formatDate } from '../../utils/format';

const CANCELLABLE_BLOCKLIST = ['SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

export default function OrderDetailScreen() {
  const route = useRoute();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);

  useEffect(() => { orderApi.getById(route.params.id).then(setOrder); }, [route.params.id]);

  function confirmCancel() {
    Alert.alert('Cancel order?', 'This cannot be undone.', [
      { text: 'Keep order', style: 'cancel' },
      { text: 'Cancel order', style: 'destructive', onPress: handleCancel }
    ]);
  }

  async function handleCancel() {
    try {
      const updated = await orderApi.cancel(route.params.id);
      setOrder(updated);
      dispatch(showToast('Order cancelled', 'success'));
    } catch (err) {
      dispatch(showToast(err.response?.data?.message || 'Could not cancel order', 'error'));
    }
  }

  if (!order) return <Screen><LoadingView label="Loading order…" /></Screen>;
  const cancellable = !CANCELLABLE_BLOCKLIST.includes(order.status);

  return (
    <Screen edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={styles.title}>{order.orderNumber}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>Placed {formatDate(order.createdAt)}</Text>
          <Badge label={order.status} tone="emerald" />
        </View>

        <View style={styles.card}>
          {order.items.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <Text style={styles.itemLabel}>{item.productName} × {item.quantity}</Text>
              <Text style={styles.itemValue}>{formatCurrency(item.totalPrice)}</Text>
            </View>
          ))}
          <View style={[styles.itemRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.totalAmount)}</Text>
          </View>
        </View>

        {order.statusHistory?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Status History</Text>
            {order.statusHistory.map((h, i) => (
              <View key={i} style={{ marginBottom: spacing.xs }}>
                <Text style={styles.historyStatus}>{h.status}</Text>
                {h.remarks ? <Text style={styles.historyRemarks}>{h.remarks}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {cancellable && <Button label="Cancel Order" variant="danger" onPress={confirmCancel} style={{ marginTop: spacing.md }} />}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: typeScale.xl, color: colors.ink },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: spacing.sm },
  meta: { fontFamily: fonts.body, fontSize: typeScale.sm, color: colors.inkSoft },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: spacing.md, marginTop: spacing.md },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.line },
  itemLabel: { fontFamily: fonts.body, fontSize: typeScale.sm, color: colors.ink, flex: 1 },
  itemValue: { fontFamily: fonts.label, fontSize: typeScale.sm, color: colors.ink },
  totalRow: { borderBottomWidth: 0, marginTop: spacing.xs },
  totalLabel: { fontFamily: fonts.bodySemibold, fontSize: typeScale.base, color: colors.ink },
  totalValue: { fontFamily: fonts.label, fontSize: typeScale.base, color: colors.ink },
  sectionTitle: { fontFamily: fonts.bodySemibold, fontSize: typeScale.sm, color: colors.ink, marginBottom: spacing.sm },
  historyStatus: { fontFamily: fonts.bodySemibold, fontSize: typeScale.xs, color: colors.ink },
  historyRemarks: { fontFamily: fonts.body, fontSize: typeScale.xs, color: colors.inkSoft }
});
