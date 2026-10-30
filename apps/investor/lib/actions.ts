"use server";

import { COOKIES, getRepo } from "@sundrop/data";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signInInvestor(formData: FormData) {
  const result = await getRepo().login("investor", String(formData.get("email") ?? ""), String(formData.get("password") ?? ""));
  if (!result.ok) return { error: result.error };
  const jar = await cookies();
  jar.set(COOKIES.investor, result.data.id, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 });
  redirect("/");
}

export async function signOutInvestor() {
  const jar = await cookies();
  const id = jar.get(COOKIES.investor)?.value;
  if (id) await getRepo().logout(id);
  jar.delete(COOKIES.investor);
  redirect("/login");
}
