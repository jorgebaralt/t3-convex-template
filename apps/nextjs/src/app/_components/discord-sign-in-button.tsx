"use client";

import { Button } from "@acme/ui/button";

import { authClient } from "~/auth/client";

export function DiscordSignInButton() {
  const handleSignIn = async () => {
    const { data } = await authClient.signIn.social({
      provider: "discord",
      callbackURL: "/",
    });
    if (data?.url) {
      window.location.href = data.url;
    }
  };

  return (
    <Button size="lg" onClick={handleSignIn}>
      Sign in with Discord
    </Button>
  );
}
