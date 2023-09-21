import { User } from "../types";

export const BASE_URL = "http://localhost:8000";

export async function signup(args: FormData) {
  const bodyData: User | {} = {};

  for (let [name, value] of args) {
    bodyData[name] = value; // key1 = value1, then key2 = value2
  }

  const response = await fetch(`${BASE_URL}/api/create-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(bodyData),
  });

  if (response.ok) {
    const data = await response.json();
    if (data.message === "성공") {
      return "success";
    }
    return "fail";
  }
}

export async function getUser() {
  const response = await fetch(`${BASE_URL}/api/get-user/3`, {
    method: "GET",
  });

  if (response.ok) {
    const data = await response.json();
    if (data) {
      return data.username;
    }
  }
}
