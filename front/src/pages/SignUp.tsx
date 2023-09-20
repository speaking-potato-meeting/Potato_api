import { useState } from "react";
import { RuleForm } from "../components/SignUp/RuleForm";
import SignUpForm from "../components/SignUp/SignUpForm";

type FormState = "signup" | "rule";

const SignUp = () => {
  const [currentState, setCurrentState] = useState<FormState>("signup");

  const onChangeForm = () => {
    if (currentState === "signup") return setCurrentState("rule");
    if (currentState === "rule") return setCurrentState("signup");
  };

  const form = "signupForm";
  return (
    <section className="SignUp">
      <header className="header">
        <h2>
          말하는 감자 이용을 위해 <strong>개인 벌금 규칙</strong> 작성이
          필요합니다.
        </h2>
      </header>
      {currentState === "signup" ? (
        <div className="RuleForm-container">
          <RuleForm onClick={onChangeForm} />
        </div>
      ) : (
        <div className="SignUpForm-container">
          <SignUpForm onClick={onChangeForm} />
        </div>
      )}
    </section>
  );
};

export default SignUp;
