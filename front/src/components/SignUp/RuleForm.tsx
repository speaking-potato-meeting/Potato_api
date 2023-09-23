import { useRef, useState } from "react";

type Rule = {
  [key: string]: number | string;
  fee: number | string;
  rule: string;
  error: string;
};

export type formProps = {
  onClick: () => void;
  signUpData: FormData;
};

type inputMap = Map<number, HTMLInputElement>;

export function RuleForm({ onClick, signUpData }: formProps) {
  const [inputFields, setInputFields] = useState<Rule[]>([
    {
      fee: "3000원",
      rule: "매일 2시간 이상 공부(안하면 결석 처리)",
      error: "",
    },
    { fee: "", rule: "", error: "" },
  ]);

  /* 한 번 유효성 검사를 거쳤는지 확인하는 검사 모드 state입니다. */
  const [validateMode, setValidateMode] = useState<boolean>(false);

  const feeRef = useRef<inputMap | null>(null);
  const ruleRef = useRef<inputMap | null>(null);

  const handleFormChange = (
    idx: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { target } = event;

    target.parentElement!.classList.remove("invalid");

    let data = [...inputFields];

    data[idx][`${target.name}`] = target.value;
    data[idx]["error"] = "";
    setInputFields(data);
  };

  const addFields = () => {
    let newField = { fee: "", rule: "", error: "" };

    /* 새로운 규칙 추가 시, 노드의 모든 invalid class를 제거합니다. */
    /* 검사 모드를 종료합니다. */
    const feeMap = getMap("fee");
    const ruleMap = getMap("rule");

    feeMap.forEach((v, k) => {
      v.parentElement!.classList.remove("invalid");
    });
    ruleMap.forEach((v, k) => {
      v.parentElement!.classList.remove("invalid");
    });

    setValidateMode(false);
    setInputFields([...inputFields, newField]);
  };

  const removeFields = (idx: number) => {
    let data = [...inputFields];
    data.splice(idx, 1);
    setInputFields(data);
  };

  function getMap(name: string) {
    if (name === "fee") {
      if (!feeRef.current) {
        feeRef.current = new Map();
      }
      return feeRef.current;
    }

    if (name === "rule") {
      if (!ruleRef.current) {
        ruleRef.current = new Map();
      }
    }
    return ruleRef.current as inputMap;
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement, Element>,
    idx: number
  ) => {
    let data = [...inputFields];

    if (!e.target.value.trim()) {
      data[idx][`${e.target.name}`] = "";

      if (validateMode) {
        e.target.parentElement!.classList.add("invalid");
      }
    }
    setInputFields(data);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    /* validate는 금액, 규칙 중 한 가지만 비었을 때 여부를 저장합니다. */
    let validate = true;

    // 금액, 규칙 둘 다 쓴 경우
    const validateForm = inputFields.map((f, idx) => {
      if (!f.fee && !f.rule) {
        return f;
      }

      // 1. 규칙은 적었는데 금액은 적지 않은 경우
      if (!f.fee) {
        console.log(`${idx}번째 금액 값만 비었습니다.`);
        validate = false;
        const map = getMap("fee");
        const node = map.get(idx);
        if (node) {
          node.parentElement!.classList.add("invalid");
        }
      }

      // 2. 금액은 적었는데 규칙은 적지 않은 경우
      if (!f.rule) {
        console.log(`${idx}번째 규칙 값만 비었습니다.`);
        validate = false;
        const map = getMap("rule");
        const node = map.get(idx);
        if (node) {
          node.parentElement!.classList.add("invalid");
        }
      }

      return f;
    });

    // 제출할 때
    if (validate) {
      const nextState = validateForm.reduce((prev: Rule[], f: Rule) => {
        if (f.fee && f.rule) {
          return [...prev, f];
        }
        return prev;
      }, []);
      // console.log(nextState);
    }

    if (!validate) {
      const nextState = validateForm.map((f) => {
        if (!f.fee && !f.rule) {
          return {
            ...f,
            error: "invalid",
          };
        }
        return f;
      });

      const focusNodeIndex = validateForm.findIndex((f) => !f.fee || !f.rule);
      getFocus(focusNodeIndex, validateForm[focusNodeIndex]);

      setValidateMode(true);
      setInputFields(nextState);
    }
  };

  function getFocus(idx: number, field: Rule) {
    const map = getMap(field.fee ? "rule" : "fee");
    const node = map.get(idx);

    node?.focus();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-header">
        <button onClick={addFields} type="button">
          +
        </button>
        <span>규칙 추가하기</span>
      </div>
      <div className="form-contents">
        <ol>
          {inputFields.map((input, idx) => {
            return (
              <li key={idx} className="field">
                <span>{idx === 0 ? "" : `${idx}.`}</span>
                <div
                  className={
                    `input${idx === 0 ? " disabled" : ""}` +
                    `${validateMode && input.error ? " invalid" : ""}`
                  }
                >
                  <input
                    ref={(node) => {
                      const map: inputMap = getMap(node?.name ?? "fee");
                      if (node) {
                        map.set(idx, node);
                        return;
                      }
                      map.delete(idx);
                    }}
                    type="text"
                    name="fee"
                    placeholder="금액"
                    value={input.fee}
                    onChange={(e) => handleFormChange(idx, e)}
                    disabled={idx === 0 ? true : undefined}
                    onBlur={(e) => handleBlur(e, idx)}
                  />
                </div>

                <div
                  className={
                    `input${idx === 0 ? " disabled" : ""}` +
                    `${validateMode && input.error ? " invalid" : ""}`
                  }
                >
                  <input
                    type="text"
                    name="rule"
                    placeholder="규칙"
                    value={input.rule}
                    onChange={(e) => handleFormChange(idx, e)}
                    ref={(node) => {
                      const map: inputMap = getMap(node?.name ?? "rule");
                      if (node) {
                        map.set(idx, node);
                        return;
                      }
                      map.delete(idx);
                    }}
                    disabled={idx === 0 ? true : undefined}
                    onBlur={(e) => handleBlur(e, idx)}
                  />
                </div>
                <button
                  type="button"
                  className="field-remove-btn"
                  onClick={() => {
                    removeFields(idx);
                  }}
                  disabled={idx === 0 ? true : undefined}
                  tabIndex={2}
                >
                  -
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="form-footer">
        <button type="button" onClick={onClick}>
          이전으로
        </button>
        <button type="submit">말하는 감자되기</button>
      </div>
    </form>
  );
}
