import { useNavigate } from "react-router-dom";
import { useUserQuery } from "../../hooks/useUserQuery";
import { useEffect } from "react";

interface RootProps {
  children: React.ReactNode;
  isAdminPage?: boolean;
}

const Root = ({ children }: RootProps) => {
  const navigate = useNavigate();

  /* 로그인이 필요한 페이지는 '수시로' 로그인이 되어있는지 확인이 필요합니다. */
  const userInfoQuery = useUserQuery({
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    userInfoQuery.refetch();
  }, [children]);

  if (userInfoQuery.isLoading || userInfoQuery.isRefetching) {
    return <>데이터를 가져오는 중입니다...</>;
  }

  if (!userInfoQuery.data)
    return (
      <>
        <div>찾을 수 없는 페이지입니다.</div>
        <button onClick={() => navigate("/")}>홈으로</button>
      </>
    );

  return (
    <div>
      <>{children}</>
    </div>
  );
};

export default Root;
