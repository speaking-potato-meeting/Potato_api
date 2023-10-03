import { User } from "../types";
import type { RuleFormData } from "../types";

type errorType = {
  loc: string[];
  msg: string;
  type: string;
};

export const BASE_URL = "http://localhost:8000";

export async function signup(formData: FormData, rules: RuleFormData[]) {
  const bodyData: Partial<User> = {};

  for (let [name, value] of formData) {
    bodyData[name] = value as string;
  }

  bodyData["individual_rule"] = rules;
  bodyData["total_fee"] = 0;
  bodyData["week_studytime"] = 0;
  bodyData["penalty"] = 0;
  bodyData["immunity"] = 0;

  const response = await fetch(`${BASE_URL}/api/accounts/create-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(bodyData),
  });

  const responseData = await response.json();

  try {
    if (response.ok) {
      if (responseData) {
        return "success";
      }
    }
    throw new Error();
  } catch (error) {
    const errorMsg = responseData.detail;
    errorMsg.map((error: errorType) => {
      console.log(`${error.loc[2]} ${error.msg}`);
    });
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
