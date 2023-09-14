import { useState } from "react";

type Rule = {
  [key: string]: number | string;
  fee: number | string;
  rule: string;
};

export function RuleForm() {
  const [inputFields, setInputFields] = useState<Rule[]>([
    { fee: "", rule: "" },
  ]);

  const handleFormChange = (
    idx: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let data = [...inputFields];
    data[idx][`${event.target.name}`] = event.target.value;
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-header">
        <button onClick={addFields}>+</button>
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
                  />
                </div>
                <button
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
        <button type="submit">말하는 감자되기</button>
      </div>
    </form>
  );
}
