import { useState } from "react";
import { login, getUser } from "../api/login";

const User = {
  id: "coenffl",
  pw: "chaessi0115@@",
};

export default function Login() {
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [userName, setUserName] = useState("");

  const handleChange = (e) => {
    const newForm = { ...loginForm };

    newForm[e.target.name] = e.target.value;

    setLoginForm(newForm);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const loginResponse = await login(loginForm);

    if (loginResponse === "success") {
      setUserName(loginForm.username);

      const getUserResponse = await getUser();
      // if (getUserResponse)
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      {userName ? <p>{userName}</p> : <p>감자 맞나요?</p>}
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
