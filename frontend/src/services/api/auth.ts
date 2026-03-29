"use server";

import { User } from "@/types/user";
import { api, fetchWithTimeout, buildHeaders } from "./client";
import { cookies } from "next/headers";

/* -------------------- AUTH -------------------- */

/**
 * @param email - User email
 * @param password - User password
 * @returns { message: string; user: User }
 * Response: { message: string; user: User }
 */
export const login = async (
  email: string,
  password: string,
): Promise<{ message: string; user: User }> => {
  const res = await fetchWithTimeout(`${api}/auth/login`, {
    method: "POST",
    headers: buildHeaders({ contentType: "application/json" }),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Login failed");
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
  return data;
};

/**
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param email - User's email
 * @param password - User's password
 * @returns { message: string; userId: string }
 * Response: { message: string; userId: string }
 */
export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<{ message: string; userId: string }> => {
  const res = await fetchWithTimeout(`${api}/auth/register`, {
    method: "POST",
    headers: buildHeaders({ contentType: "application/json" }),
    credentials: "include",
    body: JSON.stringify({ firstName, lastName, email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Registration failed");
  }

  return res.json();
};

/**
 * @param data - Personal info to update (phone, dateOfBirth, gender)
 * @returns { message: string; user: User }
 * Response: { message: string; user: User }
 */
export const updatePersonalInfo = async (
  data: { phone?: string; dateOfBirth?: string; gender?: string },
  cookie?: string,
): Promise<{ message: string; user: User }> => {
  const res = await fetchWithTimeout(`${api}/auth/me/personal-info`, {
    method: "PUT",
    headers: buildHeaders({ cookie, contentType: "application/json" }),
    credentials: cookie ? undefined : "include",
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || "Failed to update personal info");
  }
  return result;
};

/**
 * @param data - Shipping address to update (country, city, state, postalCode, streetAddress, apartment)
 * @returns { message: string; user: User }
 * Response: { message: string; user: User }
 */
export const updateShippingAddress = async (
  data: {
    country?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    streetAddress?: string;
    apartment?: string;
  },
  cookie?: string,
): Promise<{ message: string; user: User }> => {
  const res = await fetchWithTimeout(`${api}/auth/me/shipping-address`, {
    method: "PUT",
    headers: buildHeaders({ cookie, contentType: "application/json" }),
    credentials: cookie ? undefined : "include",
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || "Failed to update shipping address");
  }
  return result;
};

/**
 * @returns { message: string }
 * Response: { message: string }
 */
export const logout = async (): Promise<{ message: string }> => {
  const res = await fetchWithTimeout(`${api}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Logout failed");
  }
  const cookieStore = await cookies();
  cookieStore.delete("token");
  return res.json();
};

/**
 * @returns User | null - The current user or null if not authenticated
 * Response: User
 */
export const getCurrentUser = async (cookie?: string): Promise<User | null> => {
  const res = await fetchWithTimeout(`${api}/auth/me`, {
    headers: buildHeaders({ cookie }),
    credentials: cookie ? undefined : "include",
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data: User = await res.json();
  return data;
};

/**
 * @returns { message: string }
 * Response: { message: string }
 */
export const deleteAccount = async (
  cookie?: string,
): Promise<{ message: string }> => {
  const res = await fetchWithTimeout(`${api}/auth/account`, {
    method: "DELETE",
    headers: buildHeaders({ cookie }),
    credentials: cookie ? undefined : "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to delete account");
  }
  return data;
};
