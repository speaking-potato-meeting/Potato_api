import { useState } from "react";
import { login } from "../api/login";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loginForm, setLoginForm] = useState({
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
    <form onSubmit={handleSubmit}>
      <p>감자 맞나요?</p>
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
      <button>확인</button>
    </form>
  );
}
