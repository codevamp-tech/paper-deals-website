import { jwtDecode } from "jwt-decode";

interface MyTokenPayload {
  data: {
    pdExecutive: string;
    mobile: string;
  };
  exp?: number;
  iat?: number;
}

export function getUserFromToken() {
  if (typeof window === "undefined") return null; // ✅ Prevent SSR crash

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<MyTokenPayload>(token);
    return decoded.data; // { pdExecutive, mobile }
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}
