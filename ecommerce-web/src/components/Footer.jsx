import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <div className="site-footer__logo">Aurelia</div>
          <p className="site-footer__tagline">Fine jewellery, hallmarked and made to be handed down.</p>
        </div>
        <div>
          <div className="eyebrow">Shop</div>
          <Link to="/category/rings">Rings</Link>
          <Link to="/category/necklaces">Necklaces</Link>
          <Link to="/category/earrings">Earrings</Link>
          <Link to="/category/bangles">Bangles</Link>
        </div>
        <div>
          <div className="eyebrow">Help</div>
          <Link to="/pages/shipping-policy">Shipping policy</Link>
          <Link to="/pages/return-policy">Returns</Link>
          <Link to="/pages/size-guide">Size guide</Link>
          <Link to="/pages/faq">FAQ</Link>
        </div>
        <div>
          <div className="eyebrow">Company</div>
          <Link to="/pages/about-us">About us</Link>
          <Link to="/pages/contact-us">Contact</Link>
          <Link to="/pages/privacy-policy">Privacy policy</Link>
          <Link to="/pages/terms-and-conditions">Terms</Link>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <span>© {new Date().getFullYear()} Aurelia Jewellery. All rights reserved.</span>
      </div>
    </footer>
  );
}
