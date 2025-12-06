import { redirect } from "next/navigation";

import { Button } from "@acme/ui/button";

import { getCurrentUser, signOut } from "~/auth/server";
import { DiscordSignInButton } from "./discord-sign-in-button";

export async function AuthShowcase() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div>
        <DiscordSignInButton />
      </div>
    );
  }


  const userName = user.name ?? user.email ?? "Unknown";

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {userName}</span>
      </p>

      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await signOut();
            redirect("/");
          }}
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
