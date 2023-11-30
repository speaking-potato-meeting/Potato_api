import { useState } from "react";
import { login } from "../api/login";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface loginForm {
  [key: string]: string;
  username: string;
  password: string;
}

export default function Login() {
  const [loginForm, setLoginForm] = useState<loginForm>({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newForm = { ...loginForm };

    newForm[e.target.name] = e.target.value;

    setLoginForm(newForm);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const loginResponse = await login(loginForm);

    if (loginResponse === "success") {
      navigate("/");

      // const getUserResponse = await getUser();
      // if (getUserResponse)
      // console.log("로그인한 유저입니다.", getUserResponse);
    }
  }
  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <div className="loginForm-field">
          <label htmlFor="username">
            <span>아이디</span>
          </label>
          <div className="input">
            <input
              id="username"
              onChange={handleChange}
              name="username"
              type="text"
              placeholder="아이디를 입력해주세요"
              value={loginForm.username}
            />
          </div>
        </div>
        <div className="loginForm-field">
          <label htmlFor="password">
            <span>비밀번호</span>
          </label>
          <div className="input">
            <input
              id="password"
              onChange={handleChange}
              name="password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={loginForm.password}
            />
          </div>
        </div>
        <button type="submit" className="login-button">
          로그인
        </button>
      </form>
      <Link to={"/account/signup"} className="navigate-link">
        감자 맞나요?
      </Link>
    </div>
  );
}
