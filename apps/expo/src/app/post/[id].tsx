import { SafeAreaView, Text, View } from "react-native";
import { Stack, useGlobalSearchParams } from "expo-router";
import { useQuery } from "convex/react";

import type { Id } from "@acme/convex/data-model";
import { api } from "@acme/convex";

export default function Post() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const data = useQuery(api.core.posts.get, { id: id as Id<"post"> });

  if (!data) return null;

  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: data.title }} />
      <View className="h-full w-full p-4">
        <Text className="text-primary py-2 text-3xl font-bold">
          {data.title}
        </Text>
        <Text className="text-foreground py-4">{data.content}</Text>
      </View>
    </SafeAreaView>
  );
}
