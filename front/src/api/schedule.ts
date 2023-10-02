import { BASE_URL } from "./signup";

type scheduleResponse = "success" | "fail";

export interface ISchedule {
  id: number;
  start_date: string;
  end_date: string;
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
      end_date: args.date,
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
      const httpResponse = await createScheduleRes.json();
      if (httpResponse.success) {
        return "success";
      }

      return "fail";
    }

    throw new Error("서버 에러 발생");
  } catch (error) {
    console.log(error);
    return "fail";
  }
};

export const getSchedule = async (): Promise<ISchedule | scheduleResponse> => {
  const getScheduleRes = await fetch(`${BASE_URL}/api/schedule/schedules/2/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  try {
    if (getScheduleRes.ok) {
      const httpResponse = await getScheduleRes.json();
      return httpResponse ? httpResponse : "fail";
    }
    throw new Error("서버 에러 발생");
  } catch (error) {
    console.log(error);
    return "fail";
  }
};

export const updateSchedule = async (args: {
  id: number;
  editDate: string;
  content: string;
}): Promise<scheduleResponse> => {
  const updateScheduleRes = await fetch(
    `${BASE_URL}/api/schedule/schedules/2/`,
    {
      method: "PUT",
      body: JSON.stringify({
        start_date: args.editDate,
        end_date: args.editDate,
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
        return "success";
      }

      return "fail";
    }

    throw new Error("서버 에러 발생");
  } catch (error) {
    console.log(error);
    return "fail";
  }
};
