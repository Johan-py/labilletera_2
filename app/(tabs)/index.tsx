import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import MoneyDisplay from "@/components/MoneyDisplay";
import ActionButton from "@/components/ActionButton";

const actions = [
  { title: "Pagos", icon: "card-outline" as const, route: "/pagos", color: "#6C63FF" },
  { title: "Mi Ahorro", icon: "trending-up-outline" as const, route: "/ahorro", color: "#00B894" },
  { title: "Análisis", icon: "bar-chart-outline" as const, route: "/analisis", color: "#FD79A8" },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, Usuario</Text>
        <Text style={styles.subtitle}>Bienvenido de vuelta</Text>
      </View>

      <MoneyDisplay amount={1245800} />

      <View style={styles.actionsRow}>
        {actions.map((action) => (
          <ActionButton
            key={action.title}
            title={action.title}
            icon={action.icon}
            color={action.color}
            onPress={() => router.push(action.route as any)}
          />
        ))}
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Movimientos recientes</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No hay movimientos aún</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 24,
  },
  recentSection: {
    flex: 1,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#bbb",
    fontSize: 14,
  },
});
