import { useState, useRef } from "react";
import { signup, getUser } from "../../api/signup";

type Prop = {
  onClick: () => void;
  onSignUp: (args: FormData) => void;
};

export default function SignUpForm({ onClick, onSignUp }: Prop) {
  const focusPrivateLabel = useRef("name");
  // const [];
  const mbtiList = [
    "istj",
    "isfj",
    "infj",
    "intj",
    "istp",
    "isfp",
    "infp",
    "intp",
    "estp",
    "esfp",
    "enfp",
    "entp",
    "estj",
    "esfj",
    "enfj",
    "entj",
  ].sort((a, b) => a.localeCompare(b));

  // inputField를 제어 컴포넌트로 다룰 것인가?
  const [inputFields, setInputFields] = useState({
    email: "",
    password: "",
    password_confirm: "",
    username: "",
    birth: "",
    address: "",
    position: "",
    github: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    password_confirm: "",
    private: "",
    phone: "",
    position: "",
    github: "",
  });

  const onValidate = (
    word: string,
    value?: string | FormDataEntryValue
  ): string | void => {
    value = (value as string).trim();
    switch (word) {
      case "email":
        {
          setErrors((prev) => {
            return {
              ...prev,
              email: value ? "" : "아이디는 필수 입력 값입니다.",
            };
          });
          if (!value) {
            return "invalid";
          }
        }
        break;

      case "password":
        {
          setErrors((prev) => {
            return {
              ...prev,
              password: value ? "" : "비밀번호 설정은 필수 입력 값입니다.",
            };
          });

          if (!value) {
            return "invalid";
          }
        }
        break;

      case "password_confirm":
        {
          /* 비밀번호 재확인을 어떻게 검사할 것인가? => 제어 컴포넌트로 다룰 것인가? */
        }
        break;

      case "first_name":
      case "birth":
      case "address":
        {
          setErrors((prev) => {
            return {
              ...prev,
              private: value ? "" : "이름, 생일, 지역은 필수 입력 값입니다.",
            };
          });
          if (!value) {
            return "invalid";
          }
        }
        break;

      case "phone":
        {
          setErrors((prev) => {
            return {
              ...prev,
              phone: value ? "" : "전화번호는 필수 입력 값입니다.",
            };
          });
          if (!value) {
            return "invalid";
          }
        }
        break;

      case "position":
        {
          setErrors((prev) => {
            return {
              ...prev,
              position: value ? "" : "직무는 필수 입력 값입니다.",
            };
          });
          if (!value) {
            return "invalid";
          }
        }
        break;
      case "github":
        {
          setErrors((prev) => {
            return {
              ...prev,
              github: value ? "" : "github 주소는 필수 입력 값입니다.",
            };
          });
          if (!value) {
            return "invalid";
          }
        }
        break;
    }
  };

  // handleBlur 핸들링이 최소 7번 중복인데 해결방법은?
  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const { name, value } = e.target;
    onValidate(name, value);
    if (name === "phone") {
      e.target.value = value
        .replace(/[^0-9]/g, "")
        .replace(
          /(^02.{0}|^01.{1}|[0-9]{3,4})([0-9]{3,4})([0-9]{4})/g,
          "$1-$2-$3"
        );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.delete("password_confirm");

    let valid = true;

    // 유효성 검사(메시지 출력)
    for (let [name, value] of formData) {
      if (onValidate(name, value)) {
        valid = false;
      }
    }
    valid && onClick();
    onSignUp(formData);
  };

  return (
    <>
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <h1 className="signForm-title">회원가입</h1>

        <fieldset className="form-fieldset">
          <legend>
            <span className="sr-only">계정 정보</span>
          </legend>
          <div className={`signForm-field${errors.username ? " invalid" : ""}`}>
            <label htmlFor="field_id" className="field-label">
              <span className="field-label-txt">아이디</span>
              <span className="field_error">{errors.username}</span>
            </label>
            <div className="input">
              <input
                id="field_id"
                type="text"
                name="username"
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className={`signForm-field${errors.password ? " invalid" : ""}`}>
            <label htmlFor="field_pw" className="field-label">
              <span className="field-label-txt">비밀번호</span>
              <span className="field_error">{errors.password}</span>
            </label>
            <div className="input">
              <input
                id="field_pw"
                type="password"
                name="password"
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className="signForm-field">
            <label htmlFor="field_confirm" className="field-label">
              비밀번호 확인
            </label>
            <div className="input">
              <input
                id="field_confirm"
                type="password"
                name="password_confirm"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="form-fieldset">
          <legend>
            <span className="sr-only">인적 사항</span>
          </legend>
          <div className={`signForm-field${errors.private ? " invalid" : ""}`}>
            <label
              htmlFor={`field_${focusPrivateLabel.current}`}
              className="field-label"
            >
              <span className="field-label-txt">인적사항</span>
              <span className="field_error">{errors.private}</span>
            </label>
            <div
              className="l_row"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(12, 1fr)",
                gap: "10px",
              }}
            >
              <div style={{ gridColumn: "auto / span 4" }} className="l_col_4">
                <div className="input">
                  <input
                    type="text"
                    placeholder="이름"
                    id="field_first_name"
                    name="first_name"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <div style={{ gridColumn: "auto / span 4" }} className="l_col_4">
                <div className="input">
                  <input
                    type="text"
                    placeholder="생년월일"
                    id="field_birth"
                    name="birth"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <div style={{ gridColumn: "auto / span 4" }} className="l_col_4">
                <div className="input">
                  <input
                    type="text"
                    placeholder="지역"
                    id="field_address"
                    name="address"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`signForm-field${errors.phone ? " invalid" : ""}`}>
            <label htmlFor="field_phone" className="field-label">
              <span className="field-label-txt">전화번호</span>
              <span className="field_error">{errors.phone}</span>
            </label>
            <div className="input">
              <input
                id="field_phone"
                type="text"
                name="phone"
                onBlur={handleBlur}
                maxLength={14}
              />
            </div>
          </div>

          <div className="signForm-field">
            <label htmlFor="field_MBTI" className="field-label">
              나의 mbti는?
            </label>
            <div className="input">
              <select id="field_MBTI" defaultValue={"MBTI"} name="MBTI">
                {mbtiList.map((m, idx) => (
                  <option key={idx} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className="form-fieldset">
          <legend>
            <span className="sr-only">기타 사항</span>
          </legend>
          <div className={`signForm-field${errors.position ? " invalid" : ""}`}>
            <label htmlFor="field_position" className="field-label">
              <span className="field-label-txt">재직/희망 직무</span>
              <span className="field_error">{errors.position}</span>
            </label>
            <div className="input">
              <input
                id="field_position"
                type="text"
                name="position"
                onBlur={handleBlur}
              />
            </div>
          </div>
          <div className={`signForm-field${errors.github ? " invalid" : ""}`}>
            <label htmlFor="field_github" className="field-label">
              <span className="field-label-txt">github주소</span>
              <span className="field_error">{errors.github}</span>
            </label>
            <div className="input">
              <input
                id="field_github"
                type="text"
                name="github"
                onBlur={handleBlur}
              />
            </div>
          </div>
          <div className="signForm-field">
            <label htmlFor="field_blog" className="field-label optional">
              블로그 주소
              <span>(선택)</span>
            </label>
            <div className="input">
              <input id="field_blog" type="text" name="blog" />
            </div>
          </div>
        </fieldset>
        <button type="submit">다음으로</button>
      </form>
    </>
  );
}
