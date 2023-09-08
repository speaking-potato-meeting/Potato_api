import Schedule from "./Schedule/Schedule";
import { ISchedule } from "./Calendar";

import { useDroppable } from "@dnd-kit/core";

type Props = {
  nowDate: Date;
  day: Date;
  schedule?: ISchedule; // 스케줄이 있을수도 없을수도
};

export default function DateBox({ day, nowDate, schedule }: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: day.toString(),
  });

  const style = isOver ? { color: "green" } : undefined;

  const today = new Date();

  const dateName = getDateName();

  function getDateName(): number | string {
    if (day.getDate() === 1) {
      return `${day.getMonth() + 1}월 1일`;
    }
    return day.getDate();
  }

  return (
    <div
      style={style}
      ref={setNodeRef}
      className={`dateBox ${
        nowDate.getMonth() !== day.getMonth() && "notMonth"
      }`}
    >
      <button
        style={{
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: "0",
          borderRadius: "3px",
          height: "20px",
          width: "20px",
          padding: "0px",
          background: "white",
          boxShadow:
            "rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px",
          position: "absolute",
          top: "6px",
          left: "6px",
        }}
      >
        +
      </button>
      <span
        className={`${
          today.getDate() === day.getDate() &&
          today.getMonth() === day.getMonth() &&
          today.getFullYear() === day.getFullYear() &&
          "today"
        }`}
      >
        {dateName}
      </span>
      {schedule && <Schedule day={day} schedule={schedule}></Schedule>}
    </div>
  );
}
