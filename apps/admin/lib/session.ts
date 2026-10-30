import "server-only";
import { COOKIES, getRepo } from "@sundrop/data";
import { cookies } from "next/headers";

export async function loadAdmin() {
  const jar = await cookies();
  return getRepo().getAdmin(jar.get(COOKIES.admin)?.value);
}
