/* commentType 수정 */
export interface commentType {
  id: number;
  user_id: number; // user오면 사라질 field
  // user: User
  schedule_id: number;
  text: string;
  timestamp: Date;
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
  id: number;
  username: string;
  first_name: string;
  phone: string;
  address: string;
  github: string;
  // password: string;
  blog: string;
  MBTI: string;
  position: string;
  birth: string;
  individual_rule: RuleFormData[];
  // total_fee: number;
  // week_studytime: number;
  // penalty: number;
  // immunity: number;
  // is_admin: boolean;
  // is_active: boolean;
  // is_staff: boolean;
  // is_superuser: boolean;
  // profile_image: string;
}

export interface Todo {
  id: number;
  content: string;
}

export type ItemListProps = {
  items: { id: number; content: string }[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, newContent: string) => void;
};

export type EditorProps = {
  onAdd: (text: string) => void;
};