import { RuleForm } from "../components/SignUp/RuleForm";
import SignUpForm from "../components/SignUp/SignUpForm";

const SignUp = () => {
  return (
    <section className="SignUp">
      <header className="header">
        <h2>
          말하는 감자를 이용하기 위해 <strong>개인 벌금 규칙</strong> 작성이
          필요합니다.
        </h2>
      </header>
      <div className="RuleForm-container">
        <RuleForm />
      </div>
      <div className="SignUp-container">
        <SignUpForm />
      </div>
    </section>
  );
};

export default SignUp;
