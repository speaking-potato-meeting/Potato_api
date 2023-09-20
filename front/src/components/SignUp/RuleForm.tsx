import { useRef, useState } from "react";

type Rule = {
  [key: string]: number | string;
  fee: number | string;
  rule: string;
};

export type formProps = {
  onClick: () => void;
};

type inputMap = Map<number, HTMLInputElement>;

export function RuleForm({ onClick }: formProps) {
  const [inputFields, setInputFields] = useState<Rule[]>([
    { fee: "", rule: "" },
  ]);

  const feeRef = useRef<inputMap | null>(null);
  const ruleRef = useRef<inputMap | null>(null);

  const handleFormChange = (
    idx: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { target } = event;

    if (target.className === "invalid") {
      if (target.value.length === 0) {
        console.log(target.value, "이거 왜 안 머겅?");
        target.parentElement!.classList.add("invalid");
      }
      if (target.value.length > 0) {
        target.parentElement!.classList.remove("invalid");
      }
    }

    let data = [...inputFields];

    data[idx][`${target.name}`] = target.value;
    setInputFields(data);
  };

  const addFields = () => {
    let newField = { fee: "", rule: "" };

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let focusNode: {
      idx: number | null;
      node: HTMLInputElement | null;
    } = { idx: null, node: null };
    const validateForm = inputFields
      .map((f, idx) => {
        // 1. 금액 & 규칙 모두 적지 않았을 경우
        // if (!f.fee && !f.rule) return f;

        // 2. 규칙은 적었는데 금액은 적지 않은 경우
        if (!f.fee) {
          console.log(`${idx}번째 금액 값이 비었습니다.`);
          const map = getMap("fee");
          const node = map.get(idx);
          if (node) {
            node.classList.add("invalid");
            node.parentElement!.classList.add("invalid");
            if (!focusNode.node) {
              focusNode = {
                idx,
                node,
              };
              focusNode = focusNode.idx < idx ? focusNode : { idx, node };
              console.log(focusNode);
            }
            // node.focus();
          }
          // return f;
        }

        // 3. 금액은 적었는데 규칙은 적지 않은 경우
        if (!f.rule) {
          console.log(`${idx}번째의 규칙 값이 비었습니다.`);
          const map = getMap("rule");
          const node = map.get(idx);
          if (node) {
            node.classList.add("invalid");
            node.parentElement!.classList.add("invalid");
            if (!focusNode.node) {
              focusNode = {
                idx,
                node,
              };
              focusNode = focusNode.idx < idx ? focusNode : { idx, node };
            }
          }
        }
        return f;
      })
      .filter((value): value is Rule => value !== undefined);

    console.log(validateForm);
    if (focusNode.node) {
      focusNode.node.focus();
    }

    setInputFields(validateForm);
  };

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
                <span>{`${idx + 1}.`}</span>
                <div className="input">
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
                  />
                </div>

                <div className="input">
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
                  />
                </div>
                <button
                  type="button"
                  className="field-remove-btn"
                  onClick={() => {
                    removeFields(idx);
                  }}
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
