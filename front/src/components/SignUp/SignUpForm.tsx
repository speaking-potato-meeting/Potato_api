export default function SignUpForm() {
  const focusPrivateLabel = "name";
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

  return (
    <form>
      <h3>회원가입</h3>
      <div className="signForm-field">
        <label htmlFor="field_id" className="field-label">
          아이디
        </label>
        <div className="input">
          <input id="field_id" type="text" />
        </div>
      </div>

      <div className="signForm-field">
        <label htmlFor="field_pw" className="field-label">
          비밀번호
        </label>
        <div className="input">
          <input id="field_pw" type="password" />
        </div>
      </div>
      <div className="signForm-field">
        <label htmlFor="field_confirm" className="field-label">
          비밀번호 확인
        </label>
        <div className="input">
          <input id="field_confirm" type="password" />
        </div>
      </div>

      <div className="signForm-field">
        <label htmlFor={`field_${focusPrivateLabel}`} className="field-label">
          인적사항
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
                id="field_name"
                name="name"
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
              />
            </div>
          </div>
          <div style={{ gridColumn: "auto / span 4" }} className="l_col_4">
            <div className="input">
              <input
                type="text"
                placeholder="지역"
                id="field_location"
                name="location"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="signForm-field">
        <label htmlFor="field_mbti" className="field-label">
          나의 mbti는?
        </label>
        <div className="input">
          <select id="field_mbti">
            {mbtiList.map((m, idx) => (
              <option key={idx} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="signForm-field">
        <label htmlFor="field_position" className="field-label">
          현재 재직/희망 직무
        </label>
        <div className="input">
          <input id="field_position" type="text" />
        </div>
      </div>
      <div className="signForm-field">
        <label htmlFor="field_github" className="field-label">
          github 주소
        </label>
        <div className="input">
          <input id="field_github" type="text" />
        </div>
      </div>

      <div className="signForm-field">
        <label htmlFor="field_blog" className="field-label">
          블로그 주소
          <span>(선택)</span>
        </label>
        <div className="input">
          <input id="field_blog" type="password" />
        </div>
      </div>
    </form>
  );
}
