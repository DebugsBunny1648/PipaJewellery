import { useEffect } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import Screen from '../components/Screen';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import LoadingView from '../components/LoadingView';
import { spacing } from '../theme/tokens';

export default function WishlistScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const customer = useSelector((s) => s.auth.customer);
  const { items, status } = useSelector((s) => s.wishlist);

  useEffect(() => { if (customer) dispatch(fetchWishlist()); }, [dispatch, customer]);

  if (!customer) {
    return <Screen><EmptyState title="Sign in to see your wishlist" message="Save pieces you love and find them here." actionLabel="Sign in" onAction={() => navigation.navigate('Login')} /></Screen>;
  }
  if (status === 'loading') return <Screen><LoadingView label="Loading wishlist…" /></Screen>;
  if (items.length === 0) {
    return <Screen><EmptyState title="Your wishlist is empty" message="Tap the heart on any piece to save it here." actionLabel="Browse Jewellery" onAction={() => navigation.navigate('Shop')} /></Screen>;
  }

  return (
    <Screen edges={['top']}>
      <FlatList
        data={items}
        keyExtractor={(p) => String(p.id)}
        numColumns={2}
        contentContainerStyle={{ padding: spacing.lg }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => <ProductCard product={item} />}
      />
    </Screen>
  );
}
