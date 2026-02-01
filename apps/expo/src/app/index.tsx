import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack } from "expo-router";
import { LegendList } from "@legendapp/list";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import Toast from "react-native-toast-message";

import type { Id } from "@acme/convex/data-model";
import { api } from "~/utils/api";
import { authClient } from "~/utils/auth";

function PostCard(props: {
  post: { _id: string; title: string; content: string };
  onDelete: () => void;
}) {
  return (
    <View className="bg-muted flex flex-row rounded-lg p-4">
      <View className="grow">
        <Link
          asChild
          href={{
            pathname: "/post/[id]",
            params: { id: props.post._id },
          }}
        >
          <Pressable className="">
            <Text className="text-primary text-xl font-semibold">
              {props.post.title}
            </Text>
            <Text className="text-foreground mt-2">{props.post.content}</Text>
          </Pressable>
        </Link>
      </View>
      <Pressable onPress={props.onDelete}>
        <Text className="text-primary font-bold uppercase">Delete</Text>
      </Pressable>
    </View>
  );
}

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const createPost = useMutation(api.core.posts.create);

  const handleCreate = async () => {
    try {
      await createPost({ title, content });
      setTitle("");
      setContent("");
    } catch (err) {
      if (err instanceof ConvexError && err.data === "Unauthenticated") {
        Toast.show({ type: "error", text1: "You must be logged in to post" });
      } else {
        Toast.show({ type: "error", text1: "Failed to create post" });
      }
    }
  };

  return (
    <View className="mt-4 flex gap-2">
      <TextInput
        className="border-input bg-background text-foreground items-center rounded-md border px-3 text-lg leading-tight"
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
      />
      <TextInput
        className="border-input bg-background text-foreground items-center rounded-md border px-3 text-lg leading-tight"
        value={content}
        onChangeText={setContent}
        placeholder="Content"
      />
      <Pressable
        className="bg-primary flex items-center rounded-sm p-2"
        onPress={handleCreate}
      >
        <Text className="text-foreground">Create</Text>
      </Pressable>
    </View>
  );
}

function MobileAuth() {
  const { data: session } = authClient.useSession();

  return (
    <>
      <Text className="text-foreground pb-2 text-center text-xl font-semibold">
        {session?.user.name ? `Hello, ${session.user.name}` : "Not logged in"}
      </Text>
      <Pressable
        onPress={async () => {
          try {
            if (session) {
              await authClient.signOut();
            } else {
              await authClient.signIn.social({
                provider: "discord",
                callbackURL: "/",
              });
            }
          } catch (err) {
            console.error("Auth action failed:", err);
          }
        }}
        className="bg-primary flex items-center rounded-sm p-2"
      >
        <Text>{session ? "Sign Out" : "Sign In With Discord"}</Text>
      </Pressable>
    </>
  );
}

export default function Index() {
  const posts = useQuery(api.core.posts.list);
  const deletePostMutation = useMutation(api.core.posts.remove);

  const handleDelete = async (id: Id<"post">) => {
    try {
      await deletePostMutation({ id });
    } catch (err) {
      if (err instanceof ConvexError && err.data === "Unauthenticated") {
        Toast.show({ type: "error", text1: "You must be logged in to delete a post" });
      } else {
        Toast.show({ type: "error", text1: "Failed to delete post" });
      }
    }
  };

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="bg-background h-full w-full p-4">
        <Text className="text-foreground pb-2 text-center text-5xl font-bold">
          Create <Text className="text-primary">T3</Text> Turbo
        </Text>

        <MobileAuth />

        <View className="py-2">
          <Text className="text-primary font-semibold italic">
            Press on a post
          </Text>
        </View>

        <LegendList
          data={posts ?? []}
          estimatedItemSize={20}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={(p) => (
            <PostCard
              post={p.item}
              onDelete={() => handleDelete(p.item._id)}
            />
          )}
        />

        <CreatePost />
      </View>
    </SafeAreaView>
  );
}
