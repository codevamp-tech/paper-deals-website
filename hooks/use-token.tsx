import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface MyTokenPayload {
  data: {
    user_id: number;
    user_name: string;
    user_role: number;
    phone_no: string;
  };
  exp?: number;
  iat?: number;
}

export function getUserFromToken(): MyTokenPayload["data"] | null {
  if (typeof window === "undefined") return null; // SSR safety

  const token = Cookies.get("token"); // ✅ use cookies, not localStorage
  if (!token) return null;

  try {
    const decoded = jwtDecode<MyTokenPayload>(token);
    if (!decoded || !decoded.data) return null;
    return decoded.data; // { user_id, user_name, user_role, phone_no }
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}
