// app/profile/page.tsx (SERVER)
import { redirect } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/fetchers";
import getCookies from "@/utils/cookies";
import { User } from "@/types/types";

export default async function ProfilePage() {
  const user: User = await getCurrentUser(await getCookies());

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Header />
      <h1>{user.name}</h1>
      <Footer />
    </>
  );
}
