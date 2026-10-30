import "server-only";
import { COOKIES, getRepo } from "@sundrop/data";
import { cookies } from "next/headers";

export async function loadPortal() {
  const jar = await cookies();
  return getRepo().getInvestorPortal(jar.get(COOKIES.investor)?.value);
}
