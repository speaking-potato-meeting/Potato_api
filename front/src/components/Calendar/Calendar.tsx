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

import { useState, useEffect, useRef } from "react";

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

    newSchedule = {
      id: generateId(allSchedule) + 1,
      start_date: date,
      end_date: date,
      schedule: content,
      is_holiday: false,
    };
    return setAllSchedule([...allSchedule, newSchedule]);
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

  /* removed되고, setAllSchedule 됐는지 확인하는 flag */
  const flagRef = useRef({
    flag: false,
    editState: {} as ISchedule,
  });

  async function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;

    if (over) {
      // 옮기고자 하는 날짜 정보
      const { id } = active as { id: string };
      const [editId, editDate] = id.split("+");
      const toEditSchedule = allSchedule.find((s) => s.id === parseInt(editId));

      if (!toEditSchedule) return;

      toEditSchedule.start_date = over.id as string;
      toEditSchedule.end_date = over.id as string;

      const removedSchedule = allSchedule.filter((s) => {
        s.id !== parseInt(editId);
      });

      setAllSchedule(removedSchedule);

      flagRef.current = {
        flag: true,
        editState: toEditSchedule,
      };
      return;
    }
  }

  useEffect(() => {
    const { flag, editState } = flagRef.current;
    async function editSchedule() {
      const updateScheduleResponse = await updateSchedule({
        id: editState.id,
        editDate: editState.start_date,
        content: editState.schedule,
      });

      if (updateScheduleResponse === "success") {
        setAllSchedule([...allSchedule, editState]);
      }
    }

    if (flag) {
      editSchedule();
    }
  }, [flagRef.current]);

  useEffect(() => {
    let ignore = false;
    async function getSchedule() {
      const scheduleResponse = await getAllSchedules();
      if (scheduleResponse === null) return;
      // !ignore && setAllSchedule(scheduleResponse);
      if (!ignore || flagRef.current) {
        console.log("why,,");
        setAllSchedule(scheduleResponse);
      }
      // console.log("왤케 버벅거리냐 이유가 뭐냐");
    }

    getSchedule();

    return () => {
      ignore = true;
    };
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
          <DateController onClick={handleMonth} buttonText="오늘" />
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
