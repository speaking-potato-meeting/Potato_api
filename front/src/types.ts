export interface commentType {
  id: number;
  // username: string,
  user_id: number;
  text: string;
  timestamp: Date;
  // pf_pic: string,
}

export type Rule = {
  [key: string]: number | string;
  fee: number | string;
  rule: string;
  error: string;
};

export type RuleFormData = {
  fee: Rule["fee"];
  rule: Rule["rule"];
};

export interface User {
  [key: string]: string | RuleFormData;
  username: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  github: string;
  blog: string;
  MBTI: string;
  position: string;
  individual_rule: RuleFormData[];
  birth: string;
}
