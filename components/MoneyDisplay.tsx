import { View, Text, StyleSheet } from "react-native";

interface MoneyDisplayProps {
  amount: number;
  currency?: string;
}

export default function MoneyDisplay({ amount, currency = "$" }: MoneyDisplayProps) {
  const formatted = amount.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Saldo disponible</Text>
      <Text style={styles.amount}>
        <Text style={styles.currency}>{currency}</Text>
        {formatted}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 32,
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
    fontWeight: "500",
  },
  amount: {
    fontSize: 42,
    fontWeight: "800",
    color: "#1a1a2e",
    letterSpacing: -1,
  },
  currency: {
    fontSize: 24,
    fontWeight: "600",
    color: "#6C63FF",
  },
});
