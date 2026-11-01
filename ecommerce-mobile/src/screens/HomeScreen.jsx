import { useCallback, useEffect, useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { cmsApi } from '../api/cmsApi';
import CmsSectionRenderer from '../components/cms/CmsSectionRenderer';
import LoadingView from '../components/LoadingView';
import EmptyState from '../components/EmptyState';
import Screen from '../components/Screen';

export default function HomeScreen() {
  const [sections, setSections] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    return cmsApi.getHomepage().then(setSections).catch(() => setError(true));
  }, []);

  useEffect(() => { load(); }, [load]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  if (error) return <Screen><EmptyState title="Couldn't load the homepage" message="Pull down to try again." /></Screen>;
  if (!sections) return <Screen><LoadingView label="Loading Aurelia…" /></Screen>;
  if (sections.length === 0) return <Screen><EmptyState title="Nothing configured yet" message="Homepage sections are managed from the admin panel." /></Screen>;

  return (
    <Screen edges={['top']}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} contentContainerStyle={{ paddingBottom: 32 }}>
        {sections.map((section) => <CmsSectionRenderer key={section.id} section={section} />)}
      </ScrollView>
    </Screen>
  );
}
