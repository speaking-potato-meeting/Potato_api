import { BASE_URL } from "./signup";

export async function login(args: { username: string; password: string }) {
  const loginRes = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    body: JSON.stringify(args),
  });

  if (loginRes.ok) {
    const data = await loginRes.json();
    if (data.message === "성공") {
      return "success";
    }
    console.log(`Error: ${data.message}`);
    return null;
  }
}

export async function getUser() {
  const getUserRes = await fetch(`${BASE_URL}/api/get-user/3`);

  if (getUserRes.ok) {
    const data = await getUserRes.json();
    return data && data;
  }
}
