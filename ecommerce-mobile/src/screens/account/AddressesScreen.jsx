import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { addressApi } from '../../api/addressApi';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';
import LoadingView from '../../components/LoadingView';
import { colors, fonts, radius, spacing, typeScale } from '../../theme/tokens';

const BLANK = { label: 'Home', recipientName: '', phone: '', addressLine1: '', city: '', state: '', country: 'India', pincode: '', default: false };

export default function AddressesScreen() {
  const [addresses, setAddresses] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK);

  function refresh() { addressApi.getAll().then(setAddresses); }
  useEffect(refresh, []);

  async function handleSubmit() {
    await addressApi.create(form);
    setForm(BLANK);
    setShowForm(false);
    refresh();
  }

  if (!addresses) return <Screen><LoadingView label="Loading addresses…" /></Screen>;

  return (
    <Screen edges={['top', 'bottom']}>
      <Text style={styles.title}>Your Addresses</Text>
      <FlatList
        data={addresses}
        keyExtractor={(a) => String(a.id)}
        contentContainerStyle={{ paddingHorizontal: spacing.lg }}
        ListEmptyComponent={!showForm ? <EmptyState title="No saved addresses" message="Add one to speed up checkout." /> : null}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.recipientName} {item.default && <Badge label="Default" tone="emerald" />}</Text>
              <Text style={styles.line}>{item.addressLine1}, {item.city}, {item.state} {item.pincode}</Text>
            </View>
            <View style={{ gap: 4 }}>
              {!item.default && <Button label="Set default" variant="ghost" small onPress={() => addressApi.setDefault(item.id).then(refresh)} />}
              <Button label="Remove" variant="ghost" small onPress={() => addressApi.remove(item.id).then(refresh)} />
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={{ marginTop: spacing.md }}>
            {!showForm ? (
              <Button label="+ Add new address" variant="outline" onPress={() => setShowForm(true)} />
            ) : (
              <View>
                <TextField label="Label" value={form.label} onChangeText={(v) => setForm({ ...form, label: v })} />
                <TextField label="Full name" value={form.recipientName} onChangeText={(v) => setForm({ ...form, recipientName: v })} />
                <TextField label="Phone" keyboardType="phone-pad" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} />
                <TextField label="Address line 1" value={form.addressLine1} onChangeText={(v) => setForm({ ...form, addressLine1: v })} />
                <TextField label="City" value={form.city} onChangeText={(v) => setForm({ ...form, city: v })} />
                <TextField label="State" value={form.state} onChangeText={(v) => setForm({ ...form, state: v })} />
                <TextField label="Pincode" keyboardType="number-pad" value={form.pincode} onChangeText={(v) => setForm({ ...form, pincode: v })} />
                <Button label="Save address" onPress={handleSubmit} />
              </View>
            )}
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: typeScale.xxl, color: colors.ink, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  card: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.sm },
  name: { fontFamily: fonts.bodySemibold, fontSize: typeScale.sm, color: colors.ink },
  line: { fontFamily: fonts.body, fontSize: typeScale.xs, color: colors.inkSoft, marginTop: 2 }
});
