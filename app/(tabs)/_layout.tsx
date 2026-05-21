import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recrutamento"
        options={{
          title: "Recrutamento",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="shield.lefthalf.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cadastro"
        options={{
          title: "Cadastro",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: "Configurações",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gearshape.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gestao-candidatos"
        options={{ tabBarButton: () => null }}
      />
      <Tabs.Screen
        name="novo-candidato"
        options={{ tabBarButton: () => null }}
      />
      <Tabs.Screen
        name="status-selecao"
        options={{ tabBarButton: () => null }}
      />
      <Tabs.Screen
        name="processos-seletivos"
        options={{ tabBarButton: () => null }}
      />
      <Tabs.Screen name="avaliacoes" options={{ tabBarButton: () => null }} />
      <Tabs.Screen name="documentacao" options={{ tabBarButton: () => null }} />
      <Tabs.Screen name="comunicacao" options={{ tabBarButton: () => null }} />
      <Tabs.Screen
        name="adicionar-documentos"
        options={{ tabBarButton: () => null }}
      />
      <Tabs.Screen name="explore" options={{ tabBarButton: () => null }} />
    </Tabs>
  );
}
