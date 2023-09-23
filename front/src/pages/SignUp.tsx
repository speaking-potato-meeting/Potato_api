import { useState, useRef } from "react";
import { RuleForm } from "../components/SignUp/RuleForm";
import SignUpForm from "../components/SignUp/SignUpForm";

interface SignUpData {
  email: string;
  password: string;
  username: string;
  birth: string;
  address: string;
  phone: string;
  MBTI: string;
  position: string;
  github: string;
  blog: string;
}

const SignUp = () => {
  const ruleFormRef = useRef<HTMLLIElement>(null);
  const signupFormRef = useRef<HTMLLIElement>(null);

  const [signUpData, setSignUpData] = useState<FormData>({} as FormData);

  function onSignUp(args: FormData) {
    setSignUpData(args);
  }

  function handleScrollRuleForm() {
    if (ruleFormRef.current)
      ruleFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "start",
      });
  }

  function handleScrollSignupForm() {
    if (signupFormRef.current)
      signupFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "end",
      });
  }

  return (
    <section className="SignUp">
      <header className="header"></header>
      <ul
        style={{
          display: "flex",
          width: "800px",
          overflowX: "hidden",
          gap: "60px",
        }}
      >
        <li ref={signupFormRef}>
          <div className="SignUpForm-container">
            <SignUpForm onClick={handleScrollRuleForm} onSignUp={onSignUp} />
          </div>
        </li>
        <li ref={ruleFormRef}>
          <div className="RuleForm-container">
            <h2 className="form-title">
              말하는 감자 이용을 위해 <strong>개인 벌금 규칙</strong> 작성이
              필요합니다.
            </h2>
            <RuleForm
              onClick={handleScrollSignupForm}
              signUpData={signUpData}
            />
          </div>
        </li>
      </ul>
    </section>
  );
};

export default SignUp;
