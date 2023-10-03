export interface commentType {
  id: number;
  // username: string,
  user_id: number;
  text: string;
  timestamp: Date;
  // pf_pic: string,
}

export interface timerType {
  user_id: number;
  date: Date;
  study: number;
  is_active: boolean;
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
  [key: string]: string | number | RuleFormData[];
  first_name: string;
  username: string;
  password: string;
  birth: string;
  address: string;
  github: string;
  phone: string;
  MBTI: string;
  position: string;
  total_fee: number;
  week_studytime: number;
  penalty: number;
  immunity: number;
  // individual_rule: RuleFormData[];
  // is_admin: boolean;
  // is_active: boolean;
  // is_staff: boolean;
  // is_superuser: boolean;
  // profile_image: string;
}
