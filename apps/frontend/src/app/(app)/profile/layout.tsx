import { ReactNode } from "react";
import { getCurrentUser } from "@/services/api/auth";
import { redirect } from "next/navigation";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileTabs from "@/components/profile/ProfileTabs";

export default async function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex bg-[#f5f5f7]">
      <ProfileSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <ProfileTabs />
        {children}
      </div>
    </div>
  );
}
