import { createHmac } from "crypto";
import { cookies } from "next/headers";

export const COOKIE_NAME = "admin_session";

// Token na galing sa password mismo (HMAC), kaya hindi napeke ng iba.
export function signToken(password: string): string {
  return createHmac("sha256", password).update("kenram-admin").digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const jar = await cookies();
  return jar.get(COOKIE_NAME)?.value === signToken(password);
}