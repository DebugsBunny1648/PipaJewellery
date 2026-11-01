import EmptyState from '../components/EmptyState';

export default function NotFound() {
  return <EmptyState title="Page not found" message="The page you're looking for doesn't exist." actionLabel="Back to home" actionTo="/" />;
}
