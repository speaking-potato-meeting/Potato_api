import { BASE_URL } from "./signup";
import type { User } from "../types";

export async function login(args: { username: string; password: string }) {
  const loginRes = await fetch(`${BASE_URL}/api/accounts/login`, {
    method: "POST",
    body: JSON.stringify(args),
  });

  if (loginRes.ok) {
    const data = await loginRes.json();
    if (data.message === "성공") {
      console.log(data.message);
      return "success";
    }
    console.log(`Error: ${data.message}`);
    return null;
  }
}

export async function getCurrentUserInfo(): Promise<{
  user_id: number;
  username: string;
} | null> {
  const getUserRes = await fetch(`${BASE_URL}/api/accounts/users/3`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      // credentials: "include",
    },
  });

  return getUserRes.ok ? getUserRes.json() : null;
}
