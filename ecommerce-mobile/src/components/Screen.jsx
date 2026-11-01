import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/tokens';

export default function Screen({ children, style, edges = ['top', 'bottom'] }) {
  return (
    <SafeAreaView style={[styles.safe, style]} edges={edges}>
      <View style={styles.body}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1 }
});
