import { useNavigate } from "react-router-dom";
import { getCurrentUserInfo } from "../../api/login";
import { useEffect, useRef } from "react";
import { useCurrentUserContext } from "../../context/CurrentUserContextProvider";

interface RootProps {
  children: React.ReactNode;
  isAdminPage?: boolean;
}

const Root = ({ children, isAdminPage }: RootProps) => {
  const user = useCurrentUserContext();

  const navigate = useNavigate();

  if (!user) {
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
