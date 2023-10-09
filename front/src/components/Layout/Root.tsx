import { useLocation, useNavigate } from "react-router-dom";
import { useUserQuery } from "../../hooks/useUserQuery";
import { useQueryClient } from "react-query";
import { useCurrentUserContext } from "../../context/CurrentUserContextProvider";

interface RootProps {
  children: React.ReactNode;
  isAdminPage?: boolean;
}

const Root = ({ children, isAdminPage }: RootProps) => {
  const queryClient = useQueryClient();
  const { pathname } = useLocation();

  const { data } = useUserQuery(pathname, {
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  const navigate = useNavigate();

  if (!data) {
    return (
      <>
        <div>찾을 수 없는 페이지입니다.</div>
        <button onClick={() => navigate("/")}>홈으로</button>
      </>
    );
  }

  return (
    <div>
      <>{children}</>
    </div>
  );
};

export default Root;
