import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addressApi } from '../api/addressApi';
import { orderApi } from '../api/orderApi';
import { fetchCart } from '../store/slices/cartSlice';
import { showToast } from '../store/slices/uiSlice';
import Screen from '../components/Screen';
import Button from '../components/Button';
import TextField from '../components/TextField';
import LoadingView from '../components/LoadingView';
import { colors, fonts, radius, spacing, typeScale } from '../theme/tokens';
import { formatCurrency } from '../utils/format';

const PAYMENT_METHODS = [
  { value: 'COD', label: 'Cash on Delivery' },
  { value: 'CARD', label: 'Card' },
  { value: 'UPI', label: 'UPI' },
  { value: 'NET_BANKING', label: 'Net Banking' }
];

export default function CheckoutScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cart = useSelector((s) => s.cart.cart);

  const [addresses, setAddresses] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ recipientName: '', phone: '', addressLine1: '', city: '', state: '', country: 'India', pincode: '', default: true });

  useEffect(() => {
    dispatch(fetchCart());
    addressApi.getAll().then((list) => {
      setAddresses(list);
      const def = list.find((a) => a.default) || list[0];
      if (def) setSelectedId(def.id);
      if (list.length === 0) setShowForm(true);
    });
  }, [dispatch]);

  async function handleAddAddress() {
    const created = await addressApi.create(form);
    const updated = await addressApi.getAll();
    setAddresses(updated);
    setSelectedId(created.id);
    setShowForm(false);
  }

  async function handlePlaceOrder() {
    if (!selectedId) { dispatch(showToast('Select a shipping address', 'error')); return; }
    setPlacing(true);
    try {
      const order = await orderApi.checkout({ shippingAddressId: selectedId, paymentMethod });
      dispatch(showToast('Order placed successfully', 'success'));
      navigation.replace('OrderDetail', { id: order.id });
    } catch (err) {
      dispatch(showToast(err.response?.data?.message || 'Could not place order', 'error'));
    } finally {
      setPlacing(false);
    }
  }

  if (!addresses) return <Screen><LoadingView label="Preparing checkout…" /></Screen>;

  return (
    <Screen edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 160 }}>
        <Text style={styles.title}>Checkout</Text>

        <Text style={styles.sectionTitle}>Shipping Address</Text>
        {addresses.map((a) => (
          <Pressable key={a.id} style={[styles.addressCard, selectedId === a.id && styles.addressCardActive]} onPress={() => setSelectedId(a.id)}>
            <Text style={styles.addressName}>{a.recipientName}</Text>
            <Text style={styles.addressLine}>{a.addressLine1}, {a.city}, {a.state} {a.pincode}</Text>
            <Text style={styles.addressLine}>{a.phone}</Text>
          </Pressable>
        ))}

        {!showForm ? (
          <Button label="+ Add new address" variant="outline" onPress={() => setShowForm(true)} style={{ marginBottom: spacing.lg }} />
        ) : (
          <View style={{ marginBottom: spacing.lg }}>
            <TextField label="Full name" value={form.recipientName} onChangeText={(v) => setForm({ ...form, recipientName: v })} />
            <TextField label="Phone" keyboardType="phone-pad" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} />
            <TextField label="Address line 1" value={form.addressLine1} onChangeText={(v) => setForm({ ...form, addressLine1: v })} />
            <TextField label="City" value={form.city} onChangeText={(v) => setForm({ ...form, city: v })} />
            <TextField label="State" value={form.state} onChangeText={(v) => setForm({ ...form, state: v })} />
            <TextField label="Pincode" keyboardType="number-pad" value={form.pincode} onChangeText={(v) => setForm({ ...form, pincode: v })} />
            <Button label="Save address" variant="outline" onPress={handleAddAddress} />
          </View>
        )}

        <Text style={styles.sectionTitle}>Payment Method</Text>
        {PAYMENT_METHODS.map((m) => (
          <Pressable key={m.value} style={styles.paymentOption} onPress={() => setPaymentMethod(m.value)}>
            <View style={[styles.radio, paymentMethod === m.value && styles.radioActive]} />
            <Text style={styles.paymentLabel}>{m.label}</Text>
          </Pressable>
        ))}

        <Text style={styles.sectionTitle}>Order Summary</Text>
        {cart.items.map((i) => (
          <View key={i.id} style={styles.summaryRow}><Text style={styles.summaryLabel}>{i.productName} × {i.quantity}</Text><Text style={styles.summaryValue}>{formatCurrency(i.lineTotal)}</Text></View>
        ))}
        <View style={[styles.summaryRow, styles.totalRow]}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{formatCurrency(cart.total)}</Text></View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label={placing ? 'Placing order…' : 'Place Order'} onPress={handlePlaceOrder} loading={placing} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: typeScale.xxl, color: colors.ink, marginBottom: spacing.lg },
  sectionTitle: { fontFamily: fonts.bodySemibold, fontSize: typeScale.base, color: colors.ink, marginBottom: spacing.sm, marginTop: spacing.sm },
  addressCard: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  addressCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  addressName: { fontFamily: fonts.bodySemibold, fontSize: typeScale.sm, color: colors.ink },
  addressLine: { fontFamily: fonts.body, fontSize: typeScale.xs, color: colors.inkSoft, marginTop: 2 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.line },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.line },
  radioActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  paymentLabel: { fontFamily: fonts.body, fontSize: typeScale.sm, color: colors.ink },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  summaryLabel: { fontFamily: fonts.body, fontSize: typeScale.sm, color: colors.inkSoft, flex: 1 },
  summaryValue: { fontFamily: fonts.label, fontSize: typeScale.sm, color: colors.ink },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.line, marginTop: spacing.sm, paddingTop: spacing.sm },
  totalLabel: { fontFamily: fonts.bodySemibold, fontSize: typeScale.base, color: colors.ink },
  totalValue: { fontFamily: fonts.label, fontSize: typeScale.base, color: colors.ink },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.line }
});
