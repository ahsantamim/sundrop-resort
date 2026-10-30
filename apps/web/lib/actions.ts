"use server";

import { getRepo, type ApplicationInput, type BookingInput } from "@sundrop/data";
import { revalidatePath } from "next/cache";

export async function placeBooking(input: BookingInput) {
  const result = await getRepo().createBooking(input);
  if (result.ok) revalidatePath("/admin", "layout");
  return result;
}

export async function cancelBooking(token: string, reason?: string) {
  const result = await getRepo().cancelBooking(token, reason);
  if (result.ok) revalidatePath(`/b/${token}`);
  return result;
}

export async function submitApplication(input: ApplicationInput) {
  const result = await getRepo().createApplication(input);
  if (result.ok) {
    revalidatePath("/invest");
    revalidatePath(`/invest/${input.projectSlug}`);
  }
  return result;
}
