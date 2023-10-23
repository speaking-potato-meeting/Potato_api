import { useState, useEffect } from "react";

import type { ISchedule } from "../api/schedule";
import {
  getSchedule,
  updateSchedule,
  createSchedule,
  deleteSchedule,
} from "../api/schedule";
import { dateToString } from "../utils/getDays";

export type editSchedule = (id: number, date: string, content: string) => void;
export type addSchedule = (date: string, content: string) => void;
export type removeSchedule = (id: number) => void;

export type scheduleSetter = {
  add?: addSchedule;
  edit?: editSchedule;
  delete?: removeSchedule;
};

export default function useSchedule(allDay: Date[], nowDate: Date) {
  const [allSchedule, setAllSchedule] = useState<ISchedule[] | null>(null);

  useEffect(() => {
    let ignore = false;
    async function getAllSchedule() {
      const firstDay = allDay.shift();
      const lastDay = allDay.pop();

      if (!firstDay || !lastDay) return;

      const getScheduleResult = await getSchedule({
        first_day: dateToString(firstDay.toString()),
        last_day: dateToString(lastDay.toString()),
      });

      if (!!getScheduleResult && !ignore) setAllSchedule(getScheduleResult);
    }

    getAllSchedule();

    return () => {
      ignore = true;
    };
  }, [nowDate]);

  const editSchedule = async (id: number, date: string, content: string) => {
    const updateScheduleResponse = await updateSchedule({
      id,
      editDate: date,
      content,
    });

    if (updateScheduleResponse) {
      setAllSchedule((as) => {
        const nextState = as!.map((s: ISchedule) => {
          if (s.id === id)
            return {
              ...s,
              start_date: updateScheduleResponse.start_date,
              schedule: updateScheduleResponse.schedule,
              is_holiday: updateScheduleResponse.is_holiday,
            };
          return s;
        });
        return nextState;
      });
    }
    return;
  };

  const addNewSchedule = async (date: string, content: string) => {
    date = dateToString(date);

    const addNewScheduleResponse = await createSchedule({
      date,
      content: content.length ? content : "제목없음",
    });

    if (addNewScheduleResponse !== "fail") {
      setAllSchedule([...(allSchedule ?? []), addNewScheduleResponse]);
    }
    return;
  };

  const removeSchedule = async (id: number) => {
    const deleteScheduleMsg = await deleteSchedule(id);

    if (deleteScheduleMsg) {
      setAllSchedule(
        allSchedule ? allSchedule.filter((s) => s.id !== id) : null
      );
    }
  };

  return { allSchedule, editSchedule, addNewSchedule, removeSchedule };
}
