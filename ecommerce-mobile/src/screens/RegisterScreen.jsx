import { useState } from 'react';
import { Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError } from '../store/slices/authSlice';
import Screen from '../components/Screen';
import TextField from '../components/TextField';
import Button from '../components/Button';
import { colors, fonts, spacing, typeScale } from '../theme/tokens';

export default function RegisterScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { status, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });

  async function handleSubmit() {
    dispatch(clearAuthError());
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) navigation.goBack();
  }

  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Save addresses, track orders, build a wishlist.</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TextField label="First name" value={form.firstName} onChangeText={(v) => setForm({ ...form, firstName: v })} />
          <TextField label="Last name" value={form.lastName} onChangeText={(v) => setForm({ ...form, lastName: v })} />
          <TextField label="Email" autoCapitalize="none" keyboardType="email-address" value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} />
          <TextField label="Phone" keyboardType="phone-pad" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} />
          <TextField label="Password" secureTextEntry value={form.password} onChangeText={(v) => setForm({ ...form, password: v })} />
          <Button label={status === 'loading' ? 'Creating account…' : 'Create account'} onPress={handleSubmit} loading={status === 'loading'} style={{ marginTop: spacing.sm }} />
          <Button label="Already have an account? Sign in" variant="ghost" onPress={() => navigation.goBack()} style={{ marginTop: spacing.sm }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing.xl, flexGrow: 1, justifyContent: 'center' },
  title: { fontFamily: fonts.display, fontSize: typeScale.xxl, color: colors.ink, marginBottom: spacing.xs },
  subtitle: { fontFamily: fonts.body, fontSize: typeScale.sm, color: colors.inkSoft, marginBottom: spacing.xl },
  error: { fontFamily: fonts.body, fontSize: typeScale.sm, color: colors.danger, backgroundColor: colors.dangerTint, padding: spacing.sm, borderRadius: 8, marginBottom: spacing.md }
});
