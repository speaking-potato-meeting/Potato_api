import { createContext, useContext } from "react";
import type { User } from "../types";
import { useCurrentUserQuery } from "../hooks/useUserQuery";

const CurrentUserContext = createContext<User | null>(null);

export const useCurrentUserContext = () => {
  const currentUser = useContext(CurrentUserContext);
  if (!currentUser) {
    return;
  }

  return currentUser;
};

export default function CurrentUserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUserQuery = useCurrentUserQuery();

  if (currentUserQuery.isLoading) {
    return <>데이터를 가져오는 중입니다...</>;
  }

  if (currentUserQuery.isError) {
    return <>문제가 발생했습니다. {currentUserQuery.error}</>;
  }

  if (currentUserQuery.isSuccess)
    return (
      <CurrentUserContext.Provider value={currentUserQuery.data}>
        {children}
      </CurrentUserContext.Provider>
    );
}
