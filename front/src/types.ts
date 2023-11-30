export interface CommentProps {
  date?: string;
}

export interface CommentResponseType {
  data: {
    comment: {
      id: number;
      schedule_id: number;
      timestamp: Date;
      text: string;
    };
    user_info: UserInfo;
  };
}

/* commentType 수정 */
export interface CommentType {
  id: number;
  schedule_id: number;
  text: string;
  timestamp: Date;
  user_info: UserInfo; // user_info를 UserInfo 인터페이스로 정의한 것을 사용
}

export interface UserInfo {
  user_id: number; // 마이페이지에서 보여줄 때 필요함
  username: string; // 댓글 띄워줄 때 필요함
  profile_image: string
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
