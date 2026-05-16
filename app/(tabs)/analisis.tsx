import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function AnalisisScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Análisis</Text>
      <View style={styles.empty}>
        <Ionicons name="bar-chart-outline" size={64} color="#ddd" />
        <Text style={styles.emptyText}>Próximamente</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 24 },
  title: { fontSize: 26, fontWeight: "800", color: "#1a1a2e", paddingTop: 16 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  emptyText: { fontSize: 16, color: "#bbb", fontWeight: "500" },
});
