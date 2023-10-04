export function RuleCheckCard() {
  return (
    <li className="ruleCheck-box">
      <div className="ruleCheck-box-header">
        <a>
          <h2>멤버 이름</h2>
        </a>
      </div>
      <div className="ruleCheck-box-carousel">
        <button>&lt;</button>
        <div className="img-frame">
          <img src="images/스터디규칙.png" />
        </div>
        <button>&gt;</button>
      </div>
      <div className="ruleCheck-box-content">
        <h3>이번 주 공부시간 : 0시간</h3>
        <ul className="list">
          <li className="list-item">
            <input type="checkbox" id="30study" />
            <label htmlFor="30study">매주 30시간</label>
          </li>
          <li className="list-item">
            <input type="checkbox" id="commit" />
            <label htmlFor="commit">1일 1커밋</label>
          </li>
          <li className="list-item">
            <input type="checkbox" id="algorithm" />
            <label htmlFor="algorithm">1일 1알고리즘</label>
          </li>
          <li className="list-item">
            <input type="checkbox" id="recruit" />
            <label htmlFor="recruit">1주 1지원</label>
          </li>
        </ul>
      </div>
      <div className="ruleCheck-box-footer">
        <h3>벌금합산 : - 원</h3>
        <button className="ruleCheck-box-footer-button">초기화</button>
      </div>
    </li>
  );
}
