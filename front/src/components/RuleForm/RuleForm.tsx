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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <button onClick={addFields}>+</button>규칙 추가하기
      </div>
      {inputFields.map((input, idx) => {
        return (
          <div
            key={idx}
            style={{
              display: "flex",
              gap: "15px",
              margin: "15px",
            }}
          >
            <input
              size={7}
              type="text"
              name="fee"
              placeholder="금액"
              value={input.fee}
              onChange={(e) => handleFormChange(idx, e)}
            />
            <input
              type="text"
              name="rule"
              placeholder="규칙"
              value={input.rule}
              onChange={(e) => handleFormChange(idx, e)}
            />
            <button
              onClick={() => {
                removeFields(idx);
              }}
            >
              -
            </button>
          </div>
        );
      })}
      <button style={{ width: "100%" }}>완료</button>
    </form>
  );
}
