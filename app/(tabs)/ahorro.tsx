import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StatCard from "@/components/StatCard";

const stats = [
  { title: "Total ahorrado", value: "$ 245.800", icon: "wallet-outline" as const, color: "#6C63FF", trend: "up" as const },
  { title: "Ingresos del mes", value: "$ 180.000", icon: "arrow-down-circle-outline" as const, color: "#00B894", trend: "up" as const },
  { title: "Gastos del mes", value: "$ 95.200", icon: "arrow-up-circle-outline" as const, color: "#FF6B6B", trend: "down" as const },
  { title: "Promedio diario", value: "$ 3.173", icon: "calculator-outline" as const, color: "#FD79A8" },
];

const movements = [
  { label: "Ingresos", percentage: 65, color: "#00B894" },
  { label: "Gastos", percentage: 35, color: "#FF6B6B" },
];

export default function AhorroScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Mi Ahorro</Text>
        <Text style={styles.subtitle}>Resumen de tus finanzas</Text>

        <View style={styles.statsGrid}>
          {stats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Distribución</Text>
        <View style={styles.distributionCard}>
          {movements.map((m) => (
            <View key={m.label} style={styles.barRow}>
              <Text style={styles.barLabel}>{m.label}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${m.percentage}%`, backgroundColor: m.color },
                  ]}
                />
              </View>
              <Text style={[styles.barPercent, { color: m.color }]}>
                {m.percentage}%
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Últimos movimientos</Text>
        {["Sueldo", "Supermercado", "Netflix", "Freelance"].map((item, i) => {
          const isIncome = i % 2 === 0;
          return (
            <View key={item} style={styles.movementRow}>
              <View
                style={[
                  styles.movementDot,
                  { backgroundColor: isIncome ? "#00B894" : "#FF6B6B" },
                ]}
              />
              <Text style={styles.movementName}>{item}</Text>
              <Text
                style={[
                  styles.movementAmount,
                  { color: isIncome ? "#00B894" : "#FF6B6B" },
                ]}
              >
                {isIncome ? "+" : "-"}$ {["95.000", "32.400", "11.900", "45.000"][i]}
              </Text>
            </View>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FE",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a1a2e",
    paddingTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 12,
    marginTop: 8,
  },
  distributionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 16,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  barLabel: {
    width: 80,
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  barTrack: {
    flex: 1,
    height: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 5,
  },
  barPercent: {
    width: 40,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "700",
  },
  movementRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  movementDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  movementName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  movementAmount: {
    fontSize: 14,
    fontWeight: "700",
  },
});
