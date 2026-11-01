import { useEffect, useState } from 'react';
import { cmsApi } from '../api/cmsApi';
import CmsSectionRenderer from '../components/cms/CmsSectionRenderer';
import Loader from '../components/Loader';

export default function Home() {
  const [sections, setSections] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    cmsApi.getHomepage('WEB').then(setSections).catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p>We couldn't load the homepage content. Please refresh, or check the CMS configuration in the admin panel.</p>
      </div>
    );
  }
  if (!sections) return <Loader label="Loading Aurelia…" />;
  if (sections.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p>No homepage sections are configured yet. Add some from the admin panel's CMS builder.</p>
      </div>
    );
  }

  return (
    <div>
      {sections.map((section) => <CmsSectionRenderer key={section.id} section={section} />)}
    </div>
  );
}
