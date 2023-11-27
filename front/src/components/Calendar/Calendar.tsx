import { getDays } from "../../utils/getDays";
import DateBox from "./DateBox";
import DateController from "./DateController";
import "./style.css";

import { ScheduleDispatchContext } from "../../context/ScheduleProvider";

import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { useState } from "react";
import useSchedule from "../../hooks/useSchedule";

export type contents = {
  id: number;
  content: string;
};

type WeekBoxProps = {
  name: string;
};

export function WeekBox({ name }: WeekBoxProps) {
  return <div className={"weekBox"}>{name}</div>;
}

export default function Calendar() {
  const [nowDate, setNowDate] = useState<Date>(() => new Date());

  const weeks = ["일", "월", "화", "수", "목", "금", "토"];
  const allDay: Date[] = getDays(nowDate);

  const { allSchedule, editSchedule, addNewSchedule, removeSchedule } =
    useSchedule(allDay, nowDate);

  async function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;

    if (over) {
      // 옮기고자 하는 날짜 정보
      const { id } = active as { id: string };
      const [editId, editDate] = id.split("+");
      const toEditSchedule = allSchedule!.find(
        (s) => s.id === parseInt(editId)
      );

      if (!toEditSchedule) return;

      editSchedule(
        parseInt(editId),
        over.id.toString(),
        toEditSchedule.schedule,
        toEditSchedule.is_holiday
      );
    }
  }

  const handleMonth = (change: number): void => {
    const newDate = new Date(nowDate.getTime());
    if (change === 0) {
      return setNowDate(new Date());
    }
    newDate.setMonth(nowDate.getMonth() + change);
    setNowDate(newDate);
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const sensors = useSensors(mouseSensor);

  return (
    <section>
      <header>
        <div className={"controller"}>
          <h3>
            {nowDate.getFullYear()}년 {nowDate.getMonth() + 1}월
          </h3>
          <DateController onClick={handleMonth} buttonText="오늘" />
        </div>
        <div className={"weekContainer"}>
          {weeks.map((week, idx) => (
            <WeekBox key={idx} name={week} />
          ))}
        </div>
      </header>
      <div className={"dateContainer"}>
        <ScheduleDispatchContext.Provider
          value={{
            edit: editSchedule,
            add: addNewSchedule,
            delete: removeSchedule,
          }}
        >
          <DndContext
            collisionDetection={pointerWithin}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            {allSchedule ? (
              allDay.map((day, idx) => (
                <DateBox
                  key={idx}
                  day={day}
                  nowDate={nowDate}
                  schedule={allSchedule.filter((s) => {
                    const scheduleDate = new Date(Date.parse(s.start_date));
                    return (
                      day.getFullYear() === scheduleDate.getFullYear() &&
                      day.getMonth() === scheduleDate.getMonth() &&
                      day.getDate() === scheduleDate.getDate()
                    );
                  })}
                />
              ))
            ) : (
              <p>일정을 불러오고 있습니다.</p>
            )}
          </DndContext>
        </ScheduleDispatchContext.Provider>
      </div>
    </section>
  );
}
