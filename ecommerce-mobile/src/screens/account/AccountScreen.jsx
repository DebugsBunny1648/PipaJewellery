import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import { colors, fonts, spacing, typeScale } from '../../theme/tokens';

const MENU = [
  { label: 'My Orders', to: 'Orders', icon: '📦' },
  { label: 'Wishlist', to: 'Wishlist', icon: '♡' },
  { label: 'Addresses', to: 'Addresses', icon: '📍' },
  { label: 'About Us', to: 'StaticPage', params: { slug: 'about-us' }, icon: 'ℹ' },
  { label: 'Shipping Policy', to: 'StaticPage', params: { slug: 'shipping-policy' }, icon: '🚚' },
  { label: 'Return Policy', to: 'StaticPage', params: { slug: 'return-policy' }, icon: '↩' },
  { label: 'FAQ', to: 'StaticPage', params: { slug: 'faq' }, icon: '❓' },
  { label: 'Privacy Policy', to: 'StaticPage', params: { slug: 'privacy-policy' }, icon: '🔒' }
];

export default function AccountScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const customer = useSelector((s) => s.auth.customer);

  if (!customer) {
    return (
      <Screen>
        <EmptyState
          title="Sign in to Aurelia"
          message="Track orders, save addresses, and build your wishlist."
          actionLabel="Sign in"
          onAction={() => navigation.navigate('Login')}
        />
      </Screen>
    );
  }

  return (
    <Screen edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {customer.fullName?.split(' ')[0] || 'there'}</Text>
        <Text style={styles.email}>{customer.email}</Text>
      </View>

      <View style={styles.menu}>
        {MENU.map((item) => (
          <Pressable key={item.label} style={styles.menuItem} onPress={() => navigation.navigate(item.to, item.params)}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuChevron}>›</Text>
          </Pressable>
        ))}
      </View>

      <Button label="Sign out" variant="outline" onPress={() => dispatch(logout())} style={{ margin: spacing.lg }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: spacing.lg },
  greeting: { fontFamily: fonts.display, fontSize: typeScale.xl, color: colors.ink },
  email: { fontFamily: fonts.body, fontSize: typeScale.sm, color: colors.inkSoft, marginTop: 2 },
  menu: { paddingHorizontal: spacing.lg },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line, gap: spacing.sm },
  menuIcon: { fontSize: 18, width: 24 },
  menuLabel: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: typeScale.sm, color: colors.ink },
  menuChevron: { fontSize: 18, color: colors.inkFaint }
});
