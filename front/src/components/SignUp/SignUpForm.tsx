import { useState, useRef } from "react";

type Prop = {
  onClick: () => void;
  onSignUp: (args: FormData) => void;
};

type passwordInput = {
  [key: string]: { value: string; error: string };
  password: { value: string; error: string };
  password_confirm: { value: string; error: string };
};

type ErrorTypes = {
  username: string;
  private: string;
  phone: string;
  position: string;
  github: string;
  blog: string;
};
export default function SignUpForm({ onClick, onSignUp }: Prop) {
  const focusPrivateLabel = useRef("name");
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

  const [passwordInput, setPasswordInput] = useState<passwordInput>({
    password: { value: "", error: "" },
    password_confirm: { value: "", error: "" },
  });

  const [errors, setErrors] = useState<ErrorTypes>({
    username: "",
    private: "",
    phone: "",
    position: "",
    github: "",
    blog: "",
  });

  const onValidate = (
    word: string,
    value?: string | FormDataEntryValue
  ): string | void => {
    (!!value && (value as string).trim()) ?? "";
    switch (word) {
      case "username":
        {
          setErrors((prev) => {
            return {
              ...prev,
              username: value ? "" : "아이디는 필수 입력 값입니다.",
            };
          });
          if (!value) {
            return "invalid";
          }
        }
        break;

      case "first_name":
        {
          setErrors((prev) => {
            let message = "이름은 필수 입력 값입니다.";
            const prevMsgs = prev.private;

            const hasBirth = prevMsgs.match(/생일/g);
            const hasAddress = prevMsgs.match(/지역/g);

            if (hasBirth && hasAddress) {
              message = "이름, 생일, 지역은 필수 입력 값입니다.";
            } else if (hasBirth) {
              message = "이름, 생일은 필수 입력 값입니다.";
            } else if (hasAddress) {
              message = "이름, 지역은 필수 입력 값입니다.";
            } else {
              // message = "이름, 생일, 지역은 필수 입력 값입니다.";
            }
            console.log(message);

            return {
              ...prev,
              private: value ? "" : message,
            };
          });
          if (!value) {
            return "invalid";
          }
        }
        break;
      case "birth":
        {
          setErrors((prev) => {
            let message = "생일은 필수 입력 값입니다.";
            const prevMsgs = prev.private;

            const hasName = prevMsgs.match(/이름/g);
            const hasAddress = prevMsgs.match(/지역/g);

            if (hasName && hasAddress) {
              message = "이름, 생일, 지역은 필수 입력 값입니다.";
            } else if (hasName) {
              message = "이름, 생일은 필수 입력 값입니다.";
            } else if (hasAddress) {
              message = "이름, 주소는 필수 입력 값입니다.";
            } else {
              // message = "이름, 생일, 지역은 필수 입력 값입니다.";
            }

            return {
              ...prev,
              private: value ? "" : message,
            };
          });

          // 사용자 입력값은 모두 숫자만 받는다.(나머지는 ""처리)
          let val = value.replace(/\D/g, "");
          let leng = val.length;

          // 출력할 결과 변수
          let result = "";

          // 5개일때 - 20221 : 바로 출력
          if (leng < 6) result = val;
          // 6~7일 때 - 202210 : 2022-101으로 출력
          else if (leng < 8) {
            result += val.substring(0, 4);
            result += "-";
            result += val.substring(4);
            // 8개 일 때 - 2022-1010 : 2022-10-10으로 출력
          } else {
            result += val.substring(0, 4);
            result += "-";
            result += val.substring(4, 6);
            result += "-";
            result += val.substring(6);
          }
          return result;
        }
        if (!value) {
          return "invalid";
        }
        break;

      case "address":
        {
          setErrors((prev) => {
            let message = "지역은 필수 입력 값입니다.";
            const prevMsgs = prev.private;

            const hasName = prevMsgs.match(/이름/g);
            const hasBirth = prevMsgs.match(/생일/g);

            if (hasName && hasBirth) {
              message = "이름, 생일, 지역은 필수 입력 값입니다.";
            } else if (hasName) {
              message = "이름, 지역은 필수 입력 값입니다.";
            } else if (hasBirth) {
              message = "생일, 지역은 필수 입력 값입니다.";
            } else {
              // message = "이름, 생일, 지역은 필수 입력 값입니다.";
            }
            console.log(message);

            return {
              ...prev,
              private: value ? "" : message,
            };
          });
          if (!value) {
            return "invalid";
          }
        }
        break;

      case "phone":
        {
          if (!value) {
            return "invalid";
          }
          setErrors((prev) => {
            return {
              ...prev,
              phone: value ? "" : "전화번호는 필수 입력 값입니다.",
            };
          });
          return (value as string)
            .replace(/[^0-9]/g, "")
            .replace(
              /(^02.{0}|^01.{1}|[0-9]{3,4})([0-9]{3,4})([0-9]{4})/g,
              "$1-$2-$3"
            );
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
        let message = "";
        const RegExp =
          /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

        if (!RegExp.test(value)) {
          message = "올바른 주소를 입력해주세요.";
        }
        {
          setErrors((prev) => {
            return {
              ...prev,
              github: value ? message : "github 주소는 필수 입력 값입니다.",
            };
          });

          if (!value) {
            return "invalid";
          }
        }
        break;
      case "blog": {
        let message = "";
        const RegExp =
          /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

        if (!RegExp.test(value)) {
          message = "올바른 주소를 입력해주세요.";
        }
        setErrors((prev) => {
          return {
            ...prev,
            blog: value ? message : "",
          };
        });
      }
    }
  };

  const handleConfirmFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = { ...passwordInput };

    const { name, value } = e.target;

    newInput[name].value = value;

    setPasswordInput((prev) => {
      const { password, password_confirm: confirm } = prev;

      // 1. 비밀번호 입력할 때,
      if (name === "password") {
        if (password.error) {
          newInput["password"].error = "";
        }
        if (confirm.value !== value && value) {
          newInput["password_confirm"].error = "비밀번호가 일치하지 않습니다.";
        }
        if (confirm.value === value) {
          newInput["password_confirm"].error = "비밀번호가 일치합니다.";
        }

        if (value === "" && value !== confirm.value) {
          newInput["password_confirm"].error = "비밀번호가 일치하지 않습니다.";
        }
      }

      // 2. 비밀번호 재확인을 입력할 때,
      if (name === "password_confirm") {
        if (password.value !== value) {
          newInput["password_confirm"].error = "비밀번호가 일치하지 않습니다.";
        }
        if (password.value === value) {
          newInput["password_confirm"].error = "비밀번호가 일치합니다.";
        }
      }

      return newInput;
    });
  };

  // handleBlur 핸들링이 최소 7번 중복인데 해결방법은?
  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const { name, value } = e.target;
    const validateResult = onValidate(name, value);
    if (
      (name === "phone" || name === "birth") &&
      validateResult !== "invalid"
    ) {
      e.target.value = validateResult as string;
    }

    if (name === "password" && !value) {
      setPasswordInput({
        ...passwordInput,
        password: {
          ...passwordInput.password,
          error: "비밀번호는 필수 입력 값입니다.",
        },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.delete("password_confirm");

    let valid = true;

    // 유효성 검사(메시지 출력)
    for (let [name, value] of formData) {
      if (
        onValidate(name, value) === "invalid" ||
        !passwordInput.password.value.trim() ||
        passwordInput.password.value !== passwordInput.password_confirm.value
      ) {
        console.log(`${name}값에서 오류가 났습니다.`);
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

          <div
            className={`signForm-field${
              passwordInput.password.error ? " invalid" : ""
            }`}
          >
            <label htmlFor="field_pw" className="field-label">
              <span className="field-label-txt">비밀번호</span>
              <span className="field_error">
                {passwordInput.password.error}
              </span>
            </label>
            <div className="input">
              <input
                id="field_pw"
                type="password"
                name="password"
                onBlur={handleBlur}
                value={passwordInput.password.value}
                onChange={handleConfirmFormChange}
              />
            </div>
          </div>

          <div
            className={`signForm-field${
              passwordInput.password.value
                ? passwordInput.password.value ===
                  passwordInput.password_confirm.value
                  ? " valid"
                  : " invalid"
                : passwordInput.password.value ===
                  passwordInput.password_confirm.value
                ? ""
                : " invalid"
            }`}
          >
            <label htmlFor="field_confirm" className="field-label">
              <span className="field-label-txt"> 비밀번호 확인</span>
              <span className="field_error">
                {passwordInput.password_confirm.error}
              </span>
            </label>
            <div className="input">
              <input
                id="field_confirm"
                type="password"
                name="password_confirm"
                value={passwordInput.password_confirm.value}
                onChange={handleConfirmFormChange}
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
                    maxLength={10}
                    type="text"
                    placeholder="생일(8자리)"
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
          <div className={`signForm-field${errors.blog ? " invalid" : ""}`}>
            <label htmlFor="field_blog" className="field-label optional">
              <span className="field-label-txt">
                블로그주소<span>(선택)</span>
              </span>
              <span className="field_error">{errors.blog}</span>
            </label>
            <div className="input">
              <input
                id="field_blog"
                type="text"
                name="blog"
                onBlur={handleBlur}
              />
            </div>
          </div>
        </fieldset>
        <button type="submit">다음으로</button>
      </form>
    </>
  );
}
