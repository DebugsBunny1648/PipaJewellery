import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { pageApi } from '../api/pageApi';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

export default function StaticPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(undefined);

  useEffect(() => {
    setPage(undefined);
    pageApi.getBySlug(slug).then(setPage).catch(() => setPage(null));
  }, [slug]);

  if (page === undefined) return <Loader label="Loading…" />;
  if (page === null) return <EmptyState title="Page not found" message="This page hasn't been published yet." />;

  return (
    <div className="container" style={{ padding: 'var(--space-6) 0', maxWidth: 800, margin: '0 auto' }}>
      {page.bannerImageUrl && <img src={page.bannerImageUrl} alt="" style={{ width: '100%', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)' }} />}
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content || '' }} style={{ color: 'var(--color-ink-soft)', lineHeight: 1.7 }} />
    </div>
  );
}
