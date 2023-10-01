import { RuleCheckCard } from "../components/Admin/RuleCheckCard";
import DateController from "../components/Calendar/DateController";

export function Admin() {
  return (
    <section>
      <header className="admin-header">
        <div className="wrapper">
          <DateController onClick={() => {}} buttonText="이번 주" />
        </div>
      </header>
      <div className="admin-contents">
        <div className="wrapper">
          <ul className="ruleCheck-container">
            {["1", "2", "3", "4", "5"].map(() => (
              <RuleCheckCard />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
