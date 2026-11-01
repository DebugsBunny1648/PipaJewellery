import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OrdersScreen from '../screens/account/OrdersScreen';
import OrderDetailScreen from '../screens/account/OrderDetailScreen';
import AddressesScreen from '../screens/account/AddressesScreen';
import StaticPageScreen from '../screens/StaticPageScreen';
import { colors, fonts } from '../theme/tokens';

const Stack = createNativeStackNavigator();

/**
 * A flat root stack over the bottom tabs (rather than one nested stack per
 * tab) — simpler to reason about, and standard for e-commerce apps where
 * product/checkout/account detail screens naturally cover the tab bar.
 */
export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontFamily: fonts.displaySemibold, color: colors.ink },
        headerTintColor: colors.ink,
        headerShadowVisible: false
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Sign In' }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
      <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'Your Orders' }} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Order Details' }} />
      <Stack.Screen name="Addresses" component={AddressesScreen} options={{ title: 'Addresses' }} />
      <Stack.Screen name="StaticPage" component={StaticPageScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
}
