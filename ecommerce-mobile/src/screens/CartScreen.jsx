import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartItem, removeCartItem, applyCoupon, removeCoupon, clearCouponError } from '../store/slices/cartSlice';
import Screen from '../components/Screen';
import Button from '../components/Button';
import QuantityStepper from '../components/QuantityStepper';
import EmptyState from '../components/EmptyState';
import LoadingView from '../components/LoadingView';
import TextField from '../components/TextField';
import { colors, fonts, spacing, typeScale } from '../theme/tokens';
import { formatCurrency } from '../utils/format';

export default function CartScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const customer = useSelector((s) => s.auth.customer);
  const { cart, status, couponError } = useSelector((s) => s.cart);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  if (status === 'loading' && !cart.items.length) return <Screen><LoadingView label="Loading your cart…" /></Screen>;
  if (!cart.items.length) {
    return <Screen><EmptyState title="Your cart is empty" message="Explore the collection and find something worth keeping." actionLabel="Browse Jewellery" onAction={() => navigation.navigate('Shop')} /></Screen>;
  }

  return (
    <Screen edges={['top']}>
      <Text style={styles.title}>Your Cart</Text>
      <FlatList
        data={cart.items}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 260 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.productImage ? <Image source={{ uri: item.productImage }} style={styles.itemImage} /> : <View style={[styles.itemImage, { backgroundColor: colors.surfaceSunken }]} />}
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName} numberOfLines={1}>{item.productName}</Text>
              {item.variantLabel ? <Text style={styles.itemVariant}>{item.variantLabel}</Text> : null}
              <Text style={styles.itemPrice}>{formatCurrency(item.unitPrice)}</Text>
            </View>
            <QuantityStepper value={item.quantity} onChange={(q) => dispatch(updateCartItem({ itemId: item.id, quantity: q }))} />
            <Button label="✕" variant="ghost" small onPress={() => dispatch(removeCartItem(item.id))} />
          </View>
        )}
      />

      <View style={styles.summary}>
        <View style={styles.couponRow}>
          {cart.appliedCouponCode ? (
            <View style={styles.couponApplied}>
              <Text style={styles.couponAppliedLabel}>Coupon "{cart.appliedCouponCode}" applied</Text>
              <Button label="Remove" variant="ghost" small onPress={() => dispatch(removeCoupon())} />
            </View>
          ) : (
            <>
              <TextField
                placeholder="Coupon code"
                value={couponCode}
                onChangeText={setCouponCode}
                style={{ flex: 1, marginBottom: 0 }}
                autoCapitalize="characters"
              />
              <Button label="Apply" variant="outline" small onPress={() => { dispatch(clearCouponError()); dispatch(applyCoupon(couponCode)); }} />
            </>
          )}
        </View>
        {couponError ? <Text style={styles.couponError}>{couponError}</Text> : null}

        <View style={styles.row}><Text style={styles.rowLabel}>Subtotal</Text><Text style={styles.rowValue}>{formatCurrency(cart.subtotal)}</Text></View>
        {cart.discount > 0 && <View style={styles.row}><Text style={styles.rowLabel}>Discount</Text><Text style={[styles.rowValue, { color: colors.success }]}>−{formatCurrency(cart.discount)}</Text></View>}
        <View style={[styles.row, styles.totalRow]}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{formatCurrency(cart.total)}</Text></View>

        <Button
          label={customer ? 'Proceed to Checkout' : 'Sign in to Checkout'}
          onPress={() => navigation.navigate(customer ? 'Checkout' : 'Login')}
          style={{ marginTop: spacing.md }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: typeScale.xxl, color: colors.ink, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.line },
  itemImage: { width: 56, height: 56, borderRadius: 8 },
  itemName: { fontFamily: fonts.bodyMedium, fontSize: typeScale.sm, color: colors.ink },
  itemVariant: { fontFamily: fonts.body, fontSize: typeScale.xs, color: colors.inkSoft },
  itemPrice: { fontFamily: fonts.label, fontSize: typeScale.xs, color: colors.primaryDark, marginTop: 2 },
  summary: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.line, padding: spacing.lg
  },
  couponRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', marginBottom: spacing.sm },
  couponApplied: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.primaryTint, padding: spacing.sm, borderRadius: 8 },
  couponAppliedLabel: { fontFamily: fonts.body, fontSize: typeScale.xs, color: colors.primaryDark },
  couponError: { fontFamily: fonts.body, fontSize: typeScale.xs, color: colors.danger, marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  rowLabel: { fontFamily: fonts.body, fontSize: typeScale.sm, color: colors.inkSoft },
  rowValue: { fontFamily: fonts.label, fontSize: typeScale.sm, color: colors.ink },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.line, marginTop: spacing.xs, paddingTop: spacing.sm },
  totalLabel: { fontFamily: fonts.bodySemibold, fontSize: typeScale.base, color: colors.ink },
  totalValue: { fontFamily: fonts.label, fontSize: typeScale.base, color: colors.ink, fontWeight: '700' }
});
