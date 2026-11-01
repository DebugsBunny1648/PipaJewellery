import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, radius, typeScale } from '../theme/tokens';

export default function QuantityStepper({ value, onChange, min = 1, max = 99 }) {
  return (
    <View style={styles.wrap}>
      <Pressable style={styles.btn} onPress={() => onChange(Math.max(min, value - 1))}><Text style={styles.btnLabel}>−</Text></Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable style={styles.btn} onPress={() => onChange(Math.min(max, value + 1))}><Text style={styles.btnLabel}>+</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, overflow: 'hidden' },
  btn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  btnLabel: { fontSize: 18, color: colors.ink },
  value: { minWidth: 32, textAlign: 'center', fontFamily: fonts.label, fontSize: typeScale.sm }
});
