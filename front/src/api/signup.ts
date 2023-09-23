import { User } from "../types";
import type { RuleFormData } from "../types";

export const BASE_URL = "http://localhost:8000";

export async function signup(formData: FormData, rules: RuleFormData[]) {
  const bodyData: User = {} as User;

  for (let [name, value] of formData) {
    bodyData[name] = value;
  }

  bodyData["individual_rule"] = rules;

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
