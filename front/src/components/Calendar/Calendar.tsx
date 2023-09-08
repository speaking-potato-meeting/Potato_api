import { getDays } from "../../utils/getDays";
import DateBox from "./DateBox";
import DateController from "./DateController";
import "./style.css";

import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  UniqueIdentifier,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { useState, useEffect } from "react";

export interface ISchedule {
  id: number;
  date: string;
  contents: contents[];
}

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

const getAllSchedules = async (): Promise<ISchedule[] | null> => {
  const getRes = await fetch("/mockSchedule.json", {
    method: "GET",
  });

  if (getRes.ok) {
    const getScheduleData = await getRes.json();
    return getScheduleData.res;
  }

  return null;
};

export default function Calendar() {
  const [nowDate, setNowDate] = useState<Date>(() => new Date());
  const [allSchedule, setAllSchedule] = useState<ISchedule[] | null>([]);

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;

    function dateToString(arg: UniqueIdentifier) {
      const timeStamp = new Date(arg);
      const timeString = `${timeStamp.getFullYear()}-${(
        timeStamp.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${timeStamp.getDate().toString().padStart(2, "0")}`;
      return timeString;
    }

    if (over) {
      const { id } = active as { id: string };
      const [editId, editDate] = id.split("+");

      let uniqueId = 2;

      setAllSchedule((prev) => {
        // 수정하고자 하는 날짜 객체 가져오기(draggable)
        const wantEdit = prev?.find((s) => s.date === dateToString(editDate));
        // console.log(wantEdit);

        if (prev && wantEdit) {
          // 옮기고난 후 이전 날짜 상태
          const nextPrevSche = prev
            .map((s) => {
              if (s.date === dateToString(editDate)) {
                const { contents } = s;
                const newPrev = {
                  ...s,
                  contents: contents.filter((c) => c.id !== parseInt(editId)),
                };
                if (newPrev.contents.length < 1) {
                  console.log(`${s.date}일에 값이 없습니다.`);
                }
                return newPrev;
              }
              return s;
            })
            .filter((s) => s.contents.length !== 0);

          const nextState = nextPrevSche.map((s) => {
            // 옮기고자 하는 날짜에 스케줄이 있으면
            if (s.date === dateToString(over.id)) {
              const { contents } = wantEdit;
              const editContent = contents.find(
                (c) => c.id === parseInt(editId)
              );

              return {
                ...s,
                id: uniqueId++,
                contents: [...s.contents, { ...editContent, id: uniqueId++ }],
              } as ISchedule;
            }
            return s;
          });
          console.log(nextState);

          // 옮기고자 하는 날짜에 스케줄이 없으면
          if (
            nextState.findIndex((s) => s.date === dateToString(over.id)) === -1
          ) {
            console.log("날짜가 없어서 이거 실행");
            const newSchedule = [
              ...nextState,
              {
                id: uniqueId++,
                date: dateToString(over.id),
                contents: [
                  {
                    id: uniqueId++,
                    content:
                      wantEdit.contents.find((c) => c.id === parseInt(editId))
                        ?.content ?? "",
                  },
                ],
              },
            ];
            return newSchedule;
          }
          return nextState;
        }

        return prev;
      });
    }
  }

  useEffect(() => {
    async function getSchedule() {
      const scheduleResponse = await getAllSchedules();
      if (scheduleResponse === null) return;
      setAllSchedule(scheduleResponse);
    }

    getSchedule();
  }, [nowDate]);

  const handleMonth = (change: number): void => {
    const newDate = new Date(nowDate.getTime());
    if (change === 0) {
      return setNowDate(new Date());
    }
    newDate.setMonth(nowDate.getMonth() + change);
    setNowDate(newDate);
  };

  const weeks = ["일", "월", "화", "수", "목", "금", "토"];
  const allDay: Date[] = getDays(nowDate);

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
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
          <DateController onClick={handleMonth} />
        </div>
        <div className={"weekContainer"}>
          {weeks.map((week, idx) => (
            <WeekBox key={idx} name={week} />
          ))}
        </div>
      </header>
      <div className={"dateContainer"}>
        <DndContext
          collisionDetection={pointerWithin}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          {allDay.map((day, idx) => (
            <DateBox
              key={idx}
              day={day}
              nowDate={nowDate}
              schedule={allSchedule?.find((s) => {
                const scheduleDate = new Date(Date.parse(s.date));
                return (
                  day.getFullYear() === scheduleDate.getFullYear() &&
                  day.getMonth() === scheduleDate.getMonth() &&
                  day.getDate() === scheduleDate.getDate()
                );
              })}
            />
          ))}
        </DndContext>
      </div>
    </section>
  );
}
