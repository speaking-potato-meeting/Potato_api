import { RuleForm } from "../components/SignUp/RuleForm";
import SignUpForm from "../components/SignUp/SignUpForm";

const SignUp = () => {
  const form = "signupForm";
  return (
    <section className="SignUp">
      <header className="header">
        <h2>
          말하는 감자 이용을 위해 <strong>개인 벌금 규칙</strong> 작성이
          필요합니다.
        </h2>
      </header>
      {form === "ruleform" ? (
        <div className="RuleForm-container">
          <RuleForm />
        </div>
      ) : (
        <div className="SignUpForm-container">
          <SignUpForm />
        </div>
      )}
    </section>
  );
};

export default SignUp;
