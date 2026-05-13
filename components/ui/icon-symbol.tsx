// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "shield.lefthalf.fill": "shield",
  "gearshape.fill": "settings",
  "person.crop.circle.fill": "person",
  "person.text.rectangle.fill": "person",
  "shield.fill": "security",
  "arrow.up.doc.fill": "upload",
  "figure.run": "directions-run",
  "bubble.left.and.bubble.right.fill": "chat",
  "checkmark.seal.fill": "verified",
  circle: "radio-button-unchecked",
  "checkmark.circle.fill": "check-circle",
  "clock.fill": "schedule",
  "arrow.right.square.fill": "logout",
  "plus.circle.fill": "add-circle",
  "bell.fill": "notifications",
  "lock.fill": "lock",
  "slider.horizontal.3": "tune",
  "questionmark.circle.fill": "help",
  "doc.text.fill": "description",
  "flag.fill": "flag",
  "person.3.fill": "groups",
  calendar: "event",
  "chart.bar.fill": "bar-chart",
  stethoscope: "local-hospital",
} as const;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name as IconSymbolName]}
      style={style}
    />
  );
}
