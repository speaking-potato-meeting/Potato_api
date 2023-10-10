import { useQuery } from "react-query";
import { getCurrentUserInfo } from "../api/login";

export const useUserQuery = (options?: {
  refetchOnMount?: boolean;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
}) => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: getCurrentUserInfo,
    ...options,
  });
};

export const useCurrentUserQuery = () => {
  return useUserQuery();
};
