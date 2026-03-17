import { ReactNode } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { User } from "@/types/user";
import { getCurrentUser } from "@/services/api/auth";
import getCookies from "@/utils/cookies";
import { redirect } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const cookies = await getCookies();
  const user: User | null = await getCurrentUser(cookies);
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex gap-4">
      <div className="w-64 shrink-0 h-[calc(100vh-32px)] sticky top-4">
        <Sidebar />
      </div>
      <div className="flex-1 min-w-0">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
