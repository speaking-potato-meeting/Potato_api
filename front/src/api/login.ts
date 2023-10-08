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
    if (data) {
      return "success";
    }
    console.log(`Error: ${data.detail}`);
    return null;
  }
}

export async function getCurrentUserInfo(): Promise<User | null> {
  try {
    const getUserRes = await fetch(`${BASE_URL}/api/accounts/status`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    /* 
   * 타입 가드 함수입니다.
  API 반환 값이 변경되면 변경되거나 삭제될 예정입니다. 
  */
    function isUser(user: User | { is_logged_in: boolean }): user is User {
      return "id" in user;
    }

    if (getUserRes.ok) {
      const userInfoResult = await getUserRes.json();
      return isUser(userInfoResult) ? userInfoResult : null;
    }
    throw new Error();
  } catch (error) {
    console.log(error);
  }

  return null;
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
