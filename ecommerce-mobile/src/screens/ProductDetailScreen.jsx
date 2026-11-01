import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { productApi } from '../api/productApi';
import { reviewApi } from '../api/reviewApi';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { showToast } from '../store/slices/uiSlice';
import Screen from '../components/Screen';
import Button from '../components/Button';
import QuantityStepper from '../components/QuantityStepper';
import RatingStars from '../components/RatingStars';
import Badge from '../components/Badge';
import LoadingView from '../components/LoadingView';
import ProductCard from '../components/ProductCard';
import { colors, fonts, spacing, typeScale } from '../theme/tokens';
import { formatCurrency, formatDate } from '../utils/format';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const customer = useSelector((s) => s.auth.customer);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const isWishlisted = useSelector((s) => (product ? s.wishlist.items.some((p) => p.id === product.id) : false));

  useEffect(() => {
    productApi.getBySlug(route.params.slug).then((p) => {
      setProduct(p);
      productApi.getRelated(p.id).then(setRelated).catch(() => setRelated([]));
      reviewApi.getByProduct(p.id).then(setReviews).catch(() => setReviews([]));
    });
  }, [route.params.slug]);

  if (!product) return <Screen><LoadingView label="Loading piece…" /></Screen>;

  const hasDiscount = product.discountPrice && Number(product.discountPrice) < Number(product.price);
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const outOfStock = product.stockQuantity <= 0;

  async function handleAddToCart() {
    setAdding(true);
    try {
      await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
      dispatch(showToast('Added to cart', 'success'));
    } catch {
      dispatch(showToast('Could not add to cart', 'error'));
    } finally {
      setAdding(false);
    }
  }

  return (
    <Screen edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.imageWrap}>
          {product.images?.[0] ? (
            <Image source={{ uri: product.images[0] }} style={styles.image} contentFit="cover" />
          ) : <View style={[styles.image, { backgroundColor: colors.surfaceSunken }]} />}
        </View>

        <View style={styles.body}>
          <Text style={styles.eyebrow}>{product.categoryName}</Text>
          <Text style={styles.name}>{product.name}</Text>

          {reviews.length > 0 && (
            <View style={styles.ratingRow}>
              <RatingStars value={avgRating} />
              <Text style={styles.ratingCount}>{reviews.length} review{reviews.length > 1 ? 's' : ''}</Text>
            </View>
          )}

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatCurrency(product.finalPrice)}</Text>
            {hasDiscount && <Text style={styles.was}>{formatCurrency(product.price)}</Text>}
          </View>

          {product.shortDescription && <Text style={styles.short}>{product.shortDescription}</Text>}

          {Object.keys(product.attributes || {}).length > 0 && (
            <View style={styles.specs}>
              {Object.entries(product.attributes).map(([k, v]) => (
                <View key={k} style={styles.specRow}>
                  <Text style={styles.specKey}>{k}</Text>
                  <Text style={styles.specValue}>{v}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={{ marginBottom: spacing.md }}>
            <Badge label={outOfStock ? 'Out of stock' : 'In stock'} tone={outOfStock ? 'danger' : 'emerald'} />
          </View>

          {product.longDescription && (
            <View style={{ marginBottom: spacing.lg }}>
              <Text style={styles.sectionTitle}>Details</Text>
              <Text style={styles.long}>{product.longDescription}</Text>
            </View>
          )}

          {reviews.length > 0 && (
            <View style={{ marginBottom: spacing.lg }}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              {reviews.map((r) => (
                <View key={r.id} style={styles.review}>
                  <RatingStars value={r.rating} />
                  {r.title ? <Text style={styles.reviewTitle}>{r.title}</Text> : null}
                  <Text style={styles.reviewComment}>{r.comment}</Text>
                  <Text style={styles.reviewDate}>{formatDate(r.createdAt)}</Text>
                </View>
              ))}
            </View>
          )}

          {related.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>You may also like</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {related.map((p) => <View key={p.id} style={{ marginRight: spacing.md }}><ProductCard product={p} width={150} /></View>)}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <QuantityStepper value={quantity} onChange={setQuantity} max={Math.max(1, product.stockQuantity)} />
        <Button label={adding ? 'Adding…' : 'Add to Cart'} onPress={handleAddToCart} disabled={outOfStock || adding} style={{ flex: 1 }} />
        {customer && (
          <Button
            label={isWishlisted ? '♥' : '♡'}
            variant="outline"
            onPress={() => dispatch(toggleWishlist(product.id))}
            style={{ paddingHorizontal: spacing.lg }}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  imageWrap: { width, aspectRatio: 1 },
  image: { width: '100%', height: '100%' },
  body: { padding: spacing.lg },
  eyebrow: { fontFamily: fonts.label, fontSize: 11, letterSpacing: 1, color: colors.gold, textTransform: 'uppercase' },
  name: { fontFamily: fonts.display, fontSize: typeScale.xxl, color: colors.ink, marginVertical: spacing.xs },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  ratingCount: { fontFamily: fonts.body, fontSize: typeScale.xs, color: colors.inkSoft },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginBottom: spacing.md },
  price: { fontFamily: fonts.label, fontSize: typeScale.xl, color: colors.primaryDark },
  was: { fontFamily: fonts.label, fontSize: typeScale.base, color: colors.inkFaint, textDecorationLine: 'line-through' },
  short: { fontFamily: fonts.body, fontSize: typeScale.sm, color: colors.inkSoft, marginBottom: spacing.md, lineHeight: 20 },
  specs: { marginBottom: spacing.md },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.line },
  specKey: { fontFamily: fonts.bodyMedium, fontSize: typeScale.sm, color: colors.inkSoft },
  specValue: { fontFamily: fonts.body, fontSize: typeScale.sm, color: colors.ink },
  sectionTitle: { fontFamily: fonts.displaySemibold, fontSize: typeScale.lg, color: colors.ink, marginBottom: spacing.sm },
  long: { fontFamily: fonts.body, fontSize: typeScale.sm, color: colors.inkSoft, lineHeight: 20 },
  review: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.line },
  reviewTitle: { fontFamily: fonts.bodySemibold, fontSize: typeScale.sm, marginTop: 4 },
  reviewComment: { fontFamily: fonts.body, fontSize: typeScale.sm, color: colors.inkSoft, marginTop: 2 },
  reviewDate: { fontFamily: fonts.label, fontSize: 10, color: colors.inkFaint, marginTop: 4 },
  actionBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: spacing.sm,
    padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.line, alignItems: 'center'
  }
});
