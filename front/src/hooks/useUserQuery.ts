import { useQuery } from "react-query";
import { getCurrentUserInfo } from "../api/login";

export const useUserQuery = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: getCurrentUserInfo,
  });
};

export const useCurrentUserQuery = () => {
  return useUserQuery();
};
