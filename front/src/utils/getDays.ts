import { UniqueIdentifier } from "@dnd-kit/core";

export const getDays = (nowDate: Date) => {
  const nowYear = nowDate.getFullYear();
  const nowMonth = nowDate.getMonth();

  const dayOneWeek = new Date(nowYear, nowMonth, 1).getDay();
  const dayLastWeek = new Date(nowYear, nowMonth + 1, 0).getDay();

  const result: Date[] = [];
  const prevMonthEnd = new Date(nowYear, nowMonth, 0).getDate();
  const nowMonthEnd = new Date(nowYear, nowMonth + 1, 0).getDate();

  // console.log(dayOneWeek, dayLastWeek); // 화요일(초일), 목요일(말일)

  for (let i = dayOneWeek - 1; i >= 0; i--) {
    result.push(new Date(nowYear, nowMonth - 1, prevMonthEnd - i));
  }

  // console.log(result);

  for (let i = 1; i <= nowMonthEnd; i++) {
    result.push(new Date(nowYear, nowMonth, i));
  }

  // console.log(result);

  for (let i = 1; i < 7 - nowMonthEnd; i++) {
    result.push(new Date(nowYear, nowMonth + 1, i));
  }

  for (let i = 1; i < 7 - dayLastWeek; i++) {
    result.push(new Date(nowYear, nowMonth + 1, i));
  }

  return result;
};

export function dateToString(arg: UniqueIdentifier | Date) {
  const timeStamp = new Date(arg);
  const timeString = `${timeStamp.getFullYear()}-${(timeStamp.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${timeStamp.getDate().toString().padStart(2, "0")}`;
  return timeString;
}
