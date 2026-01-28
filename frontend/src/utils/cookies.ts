"use server";

import { cookies } from "next/headers";

export default async function getCookies() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return cookieHeader;
}