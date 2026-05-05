import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./components/profile-form";
import { MainWrapper } from "@/components/main-wrapper";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const fullName = (user.user_metadata?.full_name as string) ?? "";

  return (
    <MainWrapper>
      <ProfileForm email={user.email ?? ""} fullName={fullName} />
    </MainWrapper>
  );
}
