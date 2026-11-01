import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useDispatch } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import Constants from 'expo-constants';

import { useFonts, Fraunces_500Medium, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono';

import { store } from './src/store';
import { bootstrapAuth, sessionExpired } from './src/store/slices/authSlice';
import { setSessionExpiredHandler } from './src/api/client';
import { appConfigApi } from './src/api/appConfigApi';
import RootNavigator from './src/navigation/RootNavigator';
import LoadingView from './src/components/LoadingView';
import ToastHost from './src/components/ToastHost';
import { MaintenanceScreen, ForceUpdateScreen } from './src/screens/MaintenanceScreen';
import { colors } from './src/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Bootstrapper({ children }) {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const [gate, setGate] = useState(null); // null = ok, { type: 'maintenance' | 'update', ... }

  useEffect(() => {
    setSessionExpiredHandler(() => store.dispatch(sessionExpired()));

    (async () => {
      await dispatch(bootstrapAuth());
      try {
        const config = await appConfigApi.getMobileConfig();
        if (config.maintenanceMode) {
          setGate({ type: 'maintenance', message: config.maintenanceMessage });
        } else {
          const currentVersion = Constants.expoConfig?.version;
          const requiredVersion = Platform.OS === 'ios' ? config.appVersionIos : config.appVersionAndroid;
          const forceUpdate = Platform.OS === 'ios' ? config.forceUpdateIos : config.forceUpdateAndroid;
          if (forceUpdate && requiredVersion && requiredVersion !== currentVersion) {
            setGate({ type: 'update', storeUrl: Platform.OS === 'ios' ? config.iosStoreUrl : config.androidStoreUrl });
          }
        }
      } catch {
        // If the config endpoint is unreachable, fail open rather than lock the app out.
      }
      setReady(true);
    })();
  }, [dispatch]);

  if (!ready) return <LoadingView label="Loading Aurelia…" />;
  if (gate?.type === 'maintenance') return <MaintenanceScreen message={gate.message} />;
  if (gate?.type === 'update') return <ForceUpdateScreen storeUrl={gate.storeUrl} />;
  return children;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    IBMPlexMono_500Medium
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <NavigationContainer onReady={onLayoutRootView} theme={{ colors: { background: colors.bg } }}>
            <Bootstrapper>
              <RootNavigator />
            </Bootstrapper>
            <ToastHost />
          </NavigationContainer>
          <StatusBar style="dark" />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
