export interface commentType {
  id: number;
  name: string;
  text: string;
  timestamp: Date;
  pf_pic: string;
}

export interface User {
  username: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  github: string;
  blog: string;
  MBTI: string;
  position: string;
  individual_rule: string;
  birth: string;
}
