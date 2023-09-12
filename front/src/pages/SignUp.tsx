import { RuleForm } from "../components/RuleForm/RuleForm";

const SignUp = () => {
  return (
    <section>
      <div
        style={{
          width: "600px",
          margin: "auto",
          minHeight: "50vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RuleForm />
      </div>
    </section>
  );
};

export default SignUp;
