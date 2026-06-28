"use server";

import { User } from "@/types/user";
import { api, fetchWithTimeout, buildHeaders, unwrapData } from "./client";
import { cookies } from "next/headers";

export const login = async (
  email: string,
  password: string,
): Promise<{ message: string; user: User }> => {
  const res = await fetchWithTimeout(`${api}/auth/login`, {
    method: "POST",
    headers: await buildHeaders({ contentType: "application/json" }),
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Login failed");
  }
  const setCookieHeader = res.headers.get("set-cookie");

  if (setCookieHeader) {
    const cookiePair = setCookieHeader.split(";")[0];
    const cookieValue = cookiePair.split("=")[1];

    const cookieStore = await cookies();
    cookieStore.set("token", decodeURIComponent(cookieValue), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  }
  const data = unwrapData<{ message: string; user: User }>(json);
  return data;
};

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<{ message: string; userId: string }> => {
  const res = await fetchWithTimeout(`${api}/auth/register`, {
    method: "POST",
    headers: await buildHeaders({ contentType: "application/json" }),
    body: JSON.stringify({ firstName, lastName, email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Registration failed");
  }

  const json = await res.json();
  return unwrapData<{ message: string; userId: string }>(json);
};

export const updatePersonalInfo = async (
  data: { phone?: string; dateOfBirth?: string; gender?: string },
): Promise<{ message: string; user: User }> => {
  const res = await fetchWithTimeout(`${api}/auth/me/personal-info`, {
    method: "PUT",
    headers: await buildHeaders({ contentType: "application/json" }),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || "Failed to update personal info");
  }
  return unwrapData<{ message: string; user: User }>(result);
};

export const updateShippingAddress = async (
  data: {
    country?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    streetAddress?: string;
    apartment?: string;
  },
): Promise<{ message: string; user: User }> => {
  const res = await fetchWithTimeout(`${api}/auth/me/shipping-address`, {
    method: "PUT",
    headers: await buildHeaders({ contentType: "application/json" }),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || "Failed to update shipping address");
  }
  return unwrapData<{ message: string; user: User }>(result);
};

export const logout = async (): Promise<{ message: string }> => {
  const res = await fetchWithTimeout(`${api}/auth/logout`, {
    method: "POST",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Logout failed");
  }
  const cookieStore = await cookies();
  cookieStore.delete("token");
  const json = await res.json();
  return unwrapData<{ message: string }>(json);
};

export const getCurrentUser = async (): Promise<User | null> => {
  const res = await fetchWithTimeout(`${api}/auth/me`, {
    headers: await buildHeaders(),
    cache: "no-store",
  });

  if (!res.ok) return null;

  const json = await res.json();
  return unwrapData<User>(json);
};

export const deleteAccount = async (): Promise<{ message: string }> => {
  const res = await fetchWithTimeout(`${api}/auth/account`, {
    method: "DELETE",
    headers: await buildHeaders(),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to delete account");
  }
  return unwrapData<{ message: string }>(json);
};
