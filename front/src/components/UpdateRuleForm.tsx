import { getUserRules, userRuleCreate, userRuleRemove } from "../api/rules";
import { useEffect, useState } from "react";
import { useCurrentUserContext } from "../context/CurrentUserContextProvider";
import { useForm, useFieldArray } from "react-hook-form";
import type { UserRule } from "../api/rules";
import { DevTool } from "@hookform/devtools";
import type { RuleMsg } from "../api/rules";

type ruleStatus = 0 | 1 | 2;

type ruleData = {
  fee: number;
  rule: string;
  status: ruleStatus;
};

function UpdateRuleForm() {
  const userInfo = useCurrentUserContext();

  const [userRules, setUserRules] = useState<UserRule[] | null>(null);

  const { register, control, handleSubmit, getValues, watch } = useForm({
    defaultValues: async () => {
      if (!userInfo?.id) return;
      const res = await getUserRules(userInfo.id);
      const userRules = res?.map((r) => {
        return { fee: r.fee, rule: r.individual_rule_content, status: 0 };
      });
      return { rule: userRules };
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    name: "rule",
    control,
  });

  const onSubmit = async (data: ruleData[]) => {
    console.log("실행");
    for (const r of data.rule) {
      if (r.status === 2) {
        const removeRuleResult = await userRuleRemove(2);
        if (
          removeRuleResult &&
          removeRuleResult.message === "벌금 confirm 필드 업데이트 성공"
        )
          continue;
      }

      if (r.status === 1) {
        const createRuleResult = await userRuleCreate({
          fee: r.fee,
          individual_rule_content: r.rule,
        });
        if (createRuleResult) return;
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div key={field.id}>
            <input
              {...register(`rule.${index}.fee`)}
              className={
                getValues(`rule.${index}.status`) === 2 ? "delete" : ""
              }
              readOnly={getValues(`rule.${index}.status`) !== 1}
              placeholder="금액(원)"
            />
            <input
              {...register(`rule.${index}.rule`)}
              placeholder="규칙"
              readOnly={getValues(`rule.${index}.status`) !== 1}
              className={
                getValues(`rule.${index}.status`) === 2 ? "delete" : ""
              }
            />
            <label {...register(`rule.${index}.status`)}></label>
            {getValues(`rule.${index}.status`) === 1 ? (
              <button
                type="button"
                onClick={() => {
                  remove(index);
                }}
              >
                제거
              </button>
            ) : getValues(`rule.${index}.status`) === 2 ? (
              <button
                type="button"
                style={{ color: "red" }}
                onClick={() => {
                  update(index, {
                    status: watch(`rule.${index}.status`) === 0 ? 2 : 0,
                  });
                }}
              >
                삭제 요청됨
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  update(index, {
                    status: watch(`rule.${index}.status`) === 0 ? 2 : 0,
                  });
                }}
              >
                삭제 요청
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            append({
              fee: "",
              rule: "",
              status: 1,
            });
          }}
        >
          Append
        </button>
        <button type="submit">제출</button>
      </form>
      <DevTool control={control} /> {/* set up the dev tool */}
    </>
  );
}

export default UpdateRuleForm;
