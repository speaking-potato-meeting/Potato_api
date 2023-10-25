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
  is_staff: boolean;
  // total_fee: number;
  // week_studytime: number;
  // penalty: number;
  // immunity: number;
  // is_admin: boolean;
  // is_active: boolean;
  // is_superuser: boolean;
  // profile_image: string;
}

export interface Todo {
  id: number;
  user_id: number;
  description: string;
  is_active: false;
}

export interface TodoItemProps {
  todo: Todo;
  onDescriptionUpdate: (id: number, newDescription: string) => void;
  onDelete: (id: number) => void;
}

export interface TodoFormProps {
  onAdd: (description: string) => void;
}
