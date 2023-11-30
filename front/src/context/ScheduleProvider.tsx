import { createContext, useContext } from "react";
import type { scheduleSetter } from "../hooks/useSchedule";

export const ScheduleDispatchContext = createContext<scheduleSetter | null>(
  null
);

export const useScheduleDispatchContext = () => {
  const scheduleDispatcher = useContext(ScheduleDispatchContext);

  if (!scheduleDispatcher) return null;

  return scheduleDispatcher;
};
