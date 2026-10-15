"use server";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, signToken } from "@/lib/admin-session";

function digest(value: string): Buffer {
  return createHmac("sha256", "compare").update(value).digest();
}

export async function login(formData: FormData): Promise<void> {
  const password = process.env.ADMIN_PASSWORD;
  const input = String(formData.get("password") ?? "");

  if (!password || !timingSafeEqual(digest(input), digest(password))) {
    redirect("/admin?error=1");
  }

  const jar = await cookies();
  jar.set(COOKIE_NAME, signToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 8, // 8 oras
  });
  redirect("/admin");
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", { path: "/admin", maxAge: 0 });
  redirect("/admin");
}