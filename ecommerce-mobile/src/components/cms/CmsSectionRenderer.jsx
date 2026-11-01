import HeroBanner from './HeroBanner';
import CategoryGrid from './CategoryGrid';
import ProductCollection from './ProductCollection';
import OfferBanner from './OfferBanner';
import ImageWithText from './ImageWithText';
import StaticContentBlock from './StaticContentBlock';

/**
 * Mobile counterpart to the web app's CmsSectionRenderer — same sectionType
 * contract from /api/cms/homepage?device=MOBILE, native components instead
 * of DOM/CSS. Keeping the mapping here (not scattered in screens) means the
 * admin's CMS builder drives both storefronts identically.
 */
export default function CmsSectionRenderer({ section }) {
  switch (section.sectionType) {
    case 'HERO_BANNER':
    case 'MOBILE_APP_BANNER':
      return <HeroBanner section={section} />;
    case 'CATEGORY_GRID':
      return <CategoryGrid section={section} />;
    case 'FEATURED_PRODUCTS':
    case 'PRODUCT_SLIDER':
    case 'COLLECTION_SHOWCASE':
      return <ProductCollection section={section} source="featured" />;
    case 'NEW_ARRIVALS':
      return <ProductCollection section={section} source="new-arrivals" />;
    case 'BEST_SELLERS':
      return <ProductCollection section={section} source="best-sellers" />;
    case 'OFFER_BANNER':
    case 'PROMOTIONAL_TILE':
      return <OfferBanner section={section} />;
    case 'IMAGE_WITH_TEXT':
    case 'BRAND_STORY_SECTION':
    case 'VIDEO_SECTION':
      return <ImageWithText section={section} />;
    case 'CUSTOM_HTML_BLOCK':
    case 'STATIC_CONTENT_BLOCK':
    case 'TESTIMONIAL_SECTION':
    case 'NEWSLETTER_SECTION':
    case 'SOCIAL_FEED_SECTION':
    default:
      return <StaticContentBlock section={section} />;
  }
}
