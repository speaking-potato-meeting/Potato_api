import { useState, useEffect } from "react";

import type { ISchedule } from "../api/schedule";
import { getSchedule, updateSchedule } from "../api/schedule";
import { dateToString } from "../utils/getDays";

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

  // const removeSchedule = async (id: number) => {
  //   const deleteScheduleMsg = await deleteSchedule(id);

  //   if (deleteScheduleMsg === "success") {
  //     setAllSchedule(
  //       allSchedule ? allSchedule.filter((s) => s.id !== id) : null
  //     );
  //   }
  // };

  return { allSchedule, editSchedule };
}
