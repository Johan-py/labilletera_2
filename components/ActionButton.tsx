import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ActionButtonProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  onPress?: () => void;
}

export default function ActionButton({
  title,
  icon,
  color = "#6C63FF",
  onPress,
}: ActionButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color + "15" }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name={icon} size={28} color={color} />
      <Text style={[styles.title, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
  },
});
