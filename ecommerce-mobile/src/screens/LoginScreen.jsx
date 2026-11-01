import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearAuthError } from '../store/slices/authSlice';
import Screen from '../components/Screen';
import TextField from '../components/TextField';
import Button from '../components/Button';
import { colors, fonts, spacing, typeScale } from '../theme/tokens';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { status, error } = useSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    dispatch(clearAuthError());
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) navigation.goBack();
  }

  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to track orders and your wishlist.</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TextField label="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <TextField label="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <Button label={status === 'loading' ? 'Signing in…' : 'Sign in'} onPress={handleSubmit} loading={status === 'loading'} style={{ marginTop: spacing.sm }} />
          <Button label="Create an account" variant="ghost" onPress={() => navigation.navigate('Register')} style={{ marginTop: spacing.sm }} />
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
