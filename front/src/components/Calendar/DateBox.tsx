import Schedule from "./Schedule/Schedule";
import { ISchedule } from "../../api/schedule";

import { useDroppable } from "@dnd-kit/core";
import { useShowModal } from "./Schedule/useShowModal";
import { dateToString } from "../../utils/getDays";

import { useCurrentUserContext } from "../../context/CurrentUserContextProvider";
import { useScheduleDispatchContext } from "../../context/ScheduleProvider";

type Props = {
  nowDate: Date;
  day: Date;
  schedule?: ISchedule[]; // 스케줄이 있을수도 없을수도
};

export default function DateBox({ day, nowDate, schedule }: Props) {
  const { onShow } = useShowModal();
  const { isOver, setNodeRef } = useDroppable({
    id: dateToString(day.toString()),
  });

  const dispatch = useScheduleDispatchContext();

  const userInfo = useCurrentUserContext();

  const style = isOver ? { color: "green" } : undefined;

  const today = new Date();

  const dateName = getDateName();

  function getDateName(): number | string {
    if (day.getDate() === 1) {
      return `${day.getMonth() + 1}월 1일`;
    }
    return day.getDate();
  }

  const modalDate = `${day.getFullYear()}-${
    day.getMonth() + 1
  }-${day.getDate()}`;

  const handleAdd = () => {
    onShow({
      props: {
        date: modalDate,
        content: "",
        scheduleSetter: { add: dispatch?.add },
        is_holiday: false
      },
    });
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      className={`dateBox ${
        nowDate.getMonth() !== day.getMonth() && "notMonth"
      }`}
    >
      {userInfo?.is_staff && (
        <button className="schedule-addBtn" onClick={handleAdd}>
          +
        </button>
      )}
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
      {schedule && <Schedule day={modalDate} schedule={schedule} />}
    </div>
  );
}
