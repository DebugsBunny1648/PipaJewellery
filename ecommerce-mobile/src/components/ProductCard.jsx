import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { colors, fonts, radius, spacing, typeScale, shadow } from '../theme/tokens';
import { formatCurrency } from '../utils/format';

const CARD_WIDTH = (Dimensions.get('window').width - spacing.lg * 2 - spacing.md) / 2;

export default function ProductCard({ product, width = CARD_WIDTH }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const customer = useSelector((s) => s.auth.customer);
  const isWishlisted = useSelector((s) => s.wishlist.items.some((p) => p.id === product.id));
  const image = product.images?.[0];
  const hasDiscount = product.discountPrice && Number(product.discountPrice) < Number(product.price);

  return (
    <Pressable style={[styles.card, { width }]} onPress={() => navigation.navigate('ProductDetail', { slug: product.slug })}>
      <View style={styles.media}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} contentFit="cover" transition={200} />
        ) : (
          <View style={[styles.image, { backgroundColor: colors.surfaceSunken }]} />
        )}
        {product.newArrival && (
          <View style={styles.tag}><Text style={styles.tagLabel}>New</Text></View>
        )}
        {customer && (
          <Pressable style={styles.wishlistBtn} onPress={() => dispatch(toggleWishlist(product.id))}>
            <Text style={{ color: isWishlisted ? colors.danger : colors.ink }}>{isWishlisted ? '♥' : '♡'}</Text>
          </Pressable>
        )}
      </View>
      <Text style={styles.eyebrow} numberOfLines={1}>{product.categoryName}</Text>
      <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>{formatCurrency(product.finalPrice)}</Text>
        {hasDiscount && <Text style={styles.was}>{formatCurrency(product.price)}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.lg },
  media: { aspectRatio: 4 / 5, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surfaceSunken, ...shadow.card },
  image: { width: '100%', height: '100%' },
  tag: { position: 'absolute', top: 8, left: 8, backgroundColor: colors.goldSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill },
  tagLabel: { fontFamily: fonts.label, fontSize: 9, letterSpacing: 0.6, color: '#6B4E20', textTransform: 'uppercase' },
  wishlistBtn: { position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontFamily: fonts.label, fontSize: 9, letterSpacing: 0.8, color: colors.gold, textTransform: 'uppercase', marginTop: spacing.sm },
  name: { fontFamily: fonts.display, fontSize: typeScale.base, color: colors.ink, marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 2 },
  price: { fontFamily: fonts.label, fontSize: typeScale.sm, color: colors.primaryDark },
  was: { fontFamily: fonts.label, fontSize: typeScale.xs, color: colors.inkFaint, textDecorationLine: 'line-through' }
});
