import { View, Text, Linking, StyleSheet } from 'react-native';
import Button from '../components/Button';
import { colors, fonts, spacing, typeScale } from '../theme/tokens';

export function MaintenanceScreen({ message }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>We'll be right back</Text>
      <Text style={styles.message}>{message || 'Aurelia is undergoing scheduled maintenance. Please check back shortly.'}</Text>
    </View>
  );
}

export function ForceUpdateScreen({ storeUrl }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Update required</Text>
      <Text style={styles.message}>A new version of Aurelia is available with important fixes. Please update to continue.</Text>
      {storeUrl ? <Button label="Update Now" onPress={() => Linking.openURL(storeUrl)} style={{ marginTop: spacing.lg }} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  title: { fontFamily: fonts.display, fontSize: typeScale.xxl, color: colors.ink, marginBottom: spacing.md, textAlign: 'center' },
  message: { fontFamily: fonts.body, fontSize: typeScale.sm, color: colors.inkSoft, textAlign: 'center', lineHeight: 20 }
});
