import { BASE_URL } from "./signup";

type RuleSuccessMsg = "벌금 confirm 필드 업데이트 성공";
type RuleFailMsg = "벌금 정보가 없음.";

export type RuleMsg = {
  message: RuleSuccessMsg | RuleFailMsg;
};

/* 사용자별 규칙 반환 값 타입입니다. */
export type UserRule = {
  username: string;
  fee: number;
  individual_rule_content: string;
  /* id 값이 없다...! */
};

/* 사용자 규칙 생성시 반환 값 타입입니다. */
type crateRuleMsg = {
  success: boolean;
};

export const getUserRules = async (id: number): Promise<UserRule[] | null> => {
  try {
    const userRulesRes = await fetch(`${BASE_URL}/api/money/moneys/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (userRulesRes.ok) {
      return userRulesRes.json();
    }
    throw new Error("서버에러 발생했습니다.");
  } catch (err) {}

  return null;
};

export const userRuleRemove = async (id: number): Promise<RuleMsg | null> => {
  try {
    const removeRes = await fetch(
      `${BASE_URL}/api/money/moneys/${id}/confirm_2`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );

    if (removeRes.ok) {
      return removeRes.json();
    }
    throw new Error("서버 에러가 발생했습니다.");
  } catch (err) {}

  return null;
};

export const userRuleCreate = async (args: {
  fee: number;
  individual_rule_content: string;
}): Promise<crateRuleMsg | null> => {
  try {
    const createRes = await fetch(`${BASE_URL}/api/money/moneys`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(args),
    });

    if (createRes.ok) {
      return createRes.json();
    }
    throw new Error("서버 에러가 발생했습니다.");
  } catch (err) {}

  return null;
};
