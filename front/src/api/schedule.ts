import { BASE_URL } from "./signup";

type scheduleResponse = ISchedule | "fail";

export interface ISchedule {
  id: number;
  start_date: string;
  schedule: string;
  is_holiday: boolean;
}

export const createSchedule = async (args: {
  date: string;
  content: string;
}): Promise<scheduleResponse> => {
  const createScheduleRes = await fetch(`${BASE_URL}/api/schedule/schedules/`, {
    method: "POST",
    body: JSON.stringify({
      start_date: args.date,
      schedule: args.content,
      is_holiday: false,
    }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  try {
    if (createScheduleRes.ok) {
      return createScheduleRes.json();
    }

    throw new Error("서버 에러 발생");
  } catch (error) {
    console.log(error);
    return "fail";
  }
};

export const getSchedule = async (args: {
  first_day: string;
  last_day: string;
}): Promise<ISchedule[] | null> => {
  const { first_day, last_day } = args;

  const getScheduleRes = await fetch(
    `${BASE_URL}/api/schedule/schedules/?from_date=${first_day}&to_date=${last_day}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    }
  );

  try {
    if (getScheduleRes.ok) {
      const httpResponse = await getScheduleRes.json();
      return httpResponse ? httpResponse : null;
    }
    throw new Error("서버 에러 발생");
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateSchedule = async (args: {
  id: number;
  editDate: string;
  content: string;
}): Promise<ISchedule | null> => {
  const updateScheduleRes = await fetch(
    `${BASE_URL}/api/schedule/schedules/${args.id}/`,
    {
      method: "PUT",
      body: JSON.stringify({
        start_date: args.editDate,
        schedule: args.content,
        is_holiday: false,
      }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    }
  );

  try {
    if (updateScheduleRes.ok) {
      const httpResponse = await updateScheduleRes.json();
      if (httpResponse) {
        return httpResponse;
      }

      return null;
    }

    throw new Error("서버 에러 발생");
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteSchedule = async (id: number): Promise<"success" | null> => {
  try {
    const deleteScheduleRes = await fetch(
      `${BASE_URL}//api/schedule/schedules/${id}/`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );

    return deleteScheduleRes.ok ? deleteScheduleRes.json() : null;
  } catch (err) {
    return null;
  }
};
