import {
  createSchedule,
  getSchedule,
  updateSchedule,
} from "../../api/schedule";
import { dateToString, getDays } from "../../utils/getDays";
import DateBox from "./DateBox";
import DateController from "./DateController";
import "./style.css";
import type { ISchedule } from "../../api/schedule";

import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { useState, useEffect } from "react";

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

/* 일정 가져오는 함수 */
const getAllSchedules = async (): Promise<ISchedule[] | null> => {
  const tmpArr = []; // 임시 적용 배열(getAllSchedule api 생기면 삭제 예정)
  const getRes = await getSchedule();

  if (getRes !== "fail") {
    tmpArr.push(getRes as ISchedule);
    return tmpArr;
  }

  return null;
};

export default function Calendar() {
  const [nowDate, setNowDate] = useState<Date>(() => new Date());
  const [allSchedule, setAllSchedule] = useState<ISchedule[]>([]);

  function generateId(arr: ISchedule[] | contents[]) {
    const maxId = arr.reduce((max, obj) => (obj.id > max ? obj.id : max), 0);
    return maxId;
  }

  const addNewSchedule = async (date: string, content: string) => {
    let newSchedule: ISchedule;

    date = dateToString(date);

    const responseMsg = await createSchedule({ date, content });

    if (responseMsg === "fail") return;

    // 추가하고자 하는 날짜 객체 가져오기
    const toAddDate = allSchedule.find((s) => s.date === date);

    // 존재하는 스케줄이 없을 경우
    if (!toAddDate) {
      newSchedule = {
        id: generateId(allSchedule) + 1,
        date,
        contents: [
          {
            id: 0,
            content,
          },
        ],
      };
      return setAllSchedule([...allSchedule, newSchedule]);
    }

    newSchedule = {
      ...toAddDate,
      contents: [
        ...toAddDate.contents,
        {
          id: generateId(toAddDate.contents) + 1,
          content,
        },
      ],
    };
    return setAllSchedule((prev) =>
      prev.map((s) => {
        if (s.date === newSchedule.date) {
          return newSchedule;
        }
        return s;
      })
    );
  };

  const editSchedule = async (id: number, date: string, content: string) => {
    /* 특정 기간 일정 불러오는 api 만들어지기 전까지 사용할 프론트 state setter */
    const editedSchedule = allSchedule.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          start_date: date,
          end_date: date,
          schedule: content,
        };
      }
      return s;
    });

    const updateScheduleResponse = await updateSchedule({
      id,
      editDate: date,
      content,
    });

    if (updateScheduleResponse === "success") {
      setAllSchedule(editedSchedule);
    }
    return;
  };

  async function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;

    if (over) {
      // 옮기고자 하는 날짜 정보
      const { id } = active as { id: string };
      const [editId, editDate] = id.split("+");
      console.log(over);

      const scheduleContent = allSchedule.find(
        (s) => s.id === parseInt(editId)
      )?.schedule;

      /* 특정 기간 일정 불러오는 api 만들어지기 전까지 사용할 프론트 state setter */
      const editedSchedule = allSchedule.map((s) => {
        if (s.id === parseInt(editId)) {
          return {
            ...s,
            start_date: over.id as string,
            end_date: over.id as string,
          };
        }
        return s;
      });

      const updateScheduleResponse = await updateSchedule({
        id: parseInt(editId),
        editDate: over.id as string,
        content: scheduleContent,
      });

      if (updateScheduleResponse === "success") {
        setAllSchedule(editedSchedule);
      }
      return;
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
              schedule={allSchedule?.filter((s) => {
                const scheduleDate = new Date(Date.parse(s.start_date));
                return (
                  day.getFullYear() === scheduleDate.getFullYear() &&
                  day.getMonth() === scheduleDate.getMonth() &&
                  day.getDate() === scheduleDate.getDate()
                );
              })}
              scheduleSetter={{ addNewSchedule, editSchedule }}
            />
          ))}
        </DndContext>
      </div>
    </section>
  );
}
