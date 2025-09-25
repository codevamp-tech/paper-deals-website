"use client";

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    // Server-side (no cookies here)
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()!.split(";").shift() || null;
  }
  return null;
}
