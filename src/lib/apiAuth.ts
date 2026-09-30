import { timingSafeEqual } from "crypto";

export function isValidSecret(secret: string): boolean {
  const API_SECRET = process.env.API_SECRET;
  if (!API_SECRET || !secret || secret.length !== API_SECRET.length) {
    return false;
  }
  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
  } catch {
    return false;
  }
}
