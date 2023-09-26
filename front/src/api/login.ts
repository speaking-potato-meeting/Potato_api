import { BASE_URL } from "./signup";
import type { User } from "../types";

type responseMessage = "success" | null;

export async function login(args: { username: string; password: string }) {
  const loginRes = await fetch(`${BASE_URL}/api/accounts/login`, {
    method: "POST",
    body: JSON.stringify(args),
    credentials: "include",
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
  const getUserRes = await fetch(`${BASE_URL}/api/accounts/users/4`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  return getUserRes.ok ? getUserRes.json() : null;
}

export async function logout(): Promise<responseMessage> {
  const loginRes = await fetch(`${BASE_URL}/api/accounts/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  try {
    if (loginRes.ok) {
      console.log("로그아웃 성공");
      return "success";
    }

    throw new Error("");
  } catch (error) {
    const errorMsg = await loginRes.json();
    console.log(errorMsg.detail);
    return null;
  }
}
