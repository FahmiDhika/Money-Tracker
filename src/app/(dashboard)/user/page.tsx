import { createClient } from "@/lib/supabase/server";
import EditProfile from "./_components/edit-profile";
import { AccountActions } from "./_components/account-actions";

export const metadata = { title: "Money Tracker | User" };

export default async function UserPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("user_data")
    .select("username, profile, created_at")
    .eq("id", user?.id)
    .single();

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "-";

  return (
    <div className="mx-auto max-w-sm space-y-5">
      <EditProfile
        initialUsername={profile?.username ?? ""}
        initialAvatarUrl={profile?.profile ?? null}
        email={user?.email ?? ""}
      />
      <AccountActions memberSince={memberSince} />
    </div>
  );
}