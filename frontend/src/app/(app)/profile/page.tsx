import { getCurrentUser } from "@/services/api/auth";
import { ProfileContent } from "@/components/profile/profile-content";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <ProfileContent user={user} />;
}
