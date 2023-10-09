import type { ISchedule } from "../../api/schedule";
import useSchedule from "../../hooks/useSchedule";
import { useState } from "react";

export function AdminSchedule() {
  const [today, setToday] = useState(new Date());

  // 이번 주의 일요일을 계산
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());

  // 이번 주의 토요일을 계산
  const saturday = new Date(today);
  saturday.setDate(today.getDate() + (6 - today.getDay()));
  const weekDates = [];
  for (
    let currentDate = new Date(sunday);
    currentDate <= saturday;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    weekDates.push(new Date(currentDate));
  }

  const { allSchedule } = useSchedule(weekDates, today);

  if (allSchedule === null) return;

  return (
    <ul className="admin-schedule-container">
      {allSchedule.map((s: ISchedule, idx) => (
        <li key={idx} className="admin-schedule-box">
          <span>{s.id}</span>
          <p>{s.schedule}</p>
        </li>
      ))}
    </ul>
  );
}
