import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

const tabs = [
  { name: "index", title: "Inicio", icon: "home-outline" as const, iconFocused: "home" as const },
  { name: "pagos", title: "Pagos", icon: "card-outline" as const, iconFocused: "card" as const },
  { name: "ahorro", title: "Mi Ahorro", icon: "trending-up-outline" as const, iconFocused: "trending-up" as const },
  { name: "analisis", title: "Análisis", icon: "bar-chart-outline" as const, iconFocused: "bar-chart" as const },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6C63FF",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? tab.iconFocused : tab.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 6,
    height: 85,
    paddingBottom: 28,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
});
