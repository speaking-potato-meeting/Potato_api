import { BASE_URL } from "./signup";

type scheduleResponse = "success" | "fail";

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

export const updateSchedule = async (args: {
  date: string;
  content: string;
}): Promise<scheduleResponse> => {
  const createScheduleRes = await fetch(
    `${BASE_URL}/api/schedule/schedules/2/`,
    {
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
    }
  );

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
