import HeroBanner from './HeroBanner';
import CarouselBanner from './CarouselBanner';
import CategoryGrid from './CategoryGrid';
import ProductCollection from './ProductCollection';
import OfferBanner from './OfferBanner';
import ImageWithText from './ImageWithText';
import TestimonialSection from './TestimonialSection';
import NewsletterSection from './NewsletterSection';
import StaticContentBlock from './StaticContentBlock';

/**
 * Maps a CMS section's `sectionType` (set by admins via /api/admin/cms/sections)
 * to the component that renders it. This is the mechanism that makes the
 * homepage "fully configurable from the admin panel" — add/reorder/hide
 * sections there and this file requires zero changes.
 */
export default function CmsSectionRenderer({ section }) {
  switch (section.sectionType) {
    case 'HERO_BANNER':
      return <HeroBanner section={section} />;
    case 'CAROUSEL_BANNER':
    case 'MOBILE_APP_BANNER':
      return <CarouselBanner section={section} />;
    case 'CATEGORY_GRID':
      return <CategoryGrid section={section} />;
    case 'FEATURED_PRODUCTS':
      return <ProductCollection section={section} source="featured" />;
    case 'NEW_ARRIVALS':
      return <ProductCollection section={section} source="new-arrivals" />;
    case 'BEST_SELLERS':
      return <ProductCollection section={section} source="best-sellers" />;
    case 'PRODUCT_SLIDER':
    case 'COLLECTION_SHOWCASE':
      return <ProductCollection section={section} source="featured" horizontal />;
    case 'RECENTLY_VIEWED_PRODUCTS':
      return <ProductCollection section={section} source="recently-viewed" />;
    case 'OFFER_BANNER':
    case 'PROMOTIONAL_TILE':
      return <OfferBanner section={section} />;
    case 'IMAGE_WITH_TEXT':
    case 'BRAND_STORY_SECTION':
      return <ImageWithText section={section} />;
    case 'VIDEO_SECTION':
      return <ImageWithText section={section} video />;
    case 'TESTIMONIAL_SECTION':
      return <TestimonialSection section={section} />;
    case 'SOCIAL_FEED_SECTION':
      return <StaticContentBlock section={section} tone="social" />;
    case 'NEWSLETTER_SECTION':
      return <NewsletterSection section={section} />;
    case 'CUSTOM_HTML_BLOCK':
    case 'STATIC_CONTENT_BLOCK':
    default:
      return <StaticContentBlock section={section} />;
  }
}
