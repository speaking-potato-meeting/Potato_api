import { useQuery } from "react-query";
import { getCurrentUserInfo } from "../api/login";

export const useUserQuery = (
  key?: string,
  options?: {
    refetchOnMount?: boolean;
    enabled?: boolean;
    refetchOnWindowFocus?: boolean;
  }
) => {
  return useQuery({
    queryKey: ["userInfo", key],
    queryFn: getCurrentUserInfo,
    ...options,
  });
};

export const useCurrentUserQuery = () => {
  return useUserQuery();
};
