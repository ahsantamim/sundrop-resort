"use server";

import { COOKIES, getRepo } from "@sundrop/data";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function adminSession() {
  const jar = await cookies();
  return getRepo().getAdmin(jar.get(COOKIES.admin)?.value);
}

export async function signInAdmin(formData: FormData) {
  const result = await getRepo().login("admin", String(formData.get("email") ?? ""), String(formData.get("password") ?? ""));
  if (!result.ok) return { error: result.error };
  const jar = await cookies();
  jar.set(COOKIES.admin, result.data.id, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 });
  redirect("/");
}

export async function signOutAdmin() {
  const jar = await cookies();
  const id = jar.get(COOKIES.admin)?.value;
  if (id) await getRepo().logout(id);
  jar.delete(COOKIES.admin);
  redirect("/login");
}

export async function decideBooking(id: string, status: "confirmed" | "declined") {
  const auth = await adminSession();
  if (!auth) return { ok: false as const, error: "Sign in again." };
  const result = await getRepo().setBookingStatus(id, status);
  revalidatePath("/bookings");
  revalidatePath("/");
  return result;
}

export async function decideRequest(id: string, decision: "approved" | "declined") {
  const auth = await adminSession();
  if (!auth) return { ok: false as const, error: "Sign in again." };
  const result = await getRepo().decideApplication(id, decision);
  revalidatePath("/requests");
  revalidatePath("/");
  return result;
}
