import { useState } from 'react';
import './cms.css';

export default function NewsletterSection({ section }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="cms-newsletter">
      <div className="container cms-newsletter__inner">
        <div>
          <h2>{section.title || 'Stay in the loop'}</h2>
          <p>{section.description || 'New collections and private previews, occasionally, never spam.'}</p>
        </div>
        {submitted ? (
          <p className="cms-newsletter__thanks">You're on the list.</p>
        ) : (
          <form className="cms-newsletter__form" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
            <input
              type="email" required placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)} className="input"
            />
            <button className="btn btn-primary" type="submit">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}
