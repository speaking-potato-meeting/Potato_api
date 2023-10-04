import { useNavigate, useOutletContext } from "react-router-dom";
import { getCurrentUserInfo } from "../../api/login";
import { useEffect, useRef } from "react";
import { useUser } from "./GeneralLayout";
// import type {User} from '../../types'

interface RootProps {
  children: React.ReactNode;
  isAdminPage?: boolean;
}

const Root = ({ children, isAdminPage }: RootProps) => {
  const { userProfile } = useOutletContext<{
    userProfile: { user_id: number; username: string };
    onSetUser: () => void;
  }>();

  const ignoreRef = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(`유저가 있어! ${userProfile}`);
    if (!ignoreRef.current && !userProfile) {
      const userResponse = confirm(
        "로그인이 필요한 페이지입니다. 로그인 페이지로 이동하시겠습니까?"
      );
      userResponse === true ? navigate("/account/login") : navigate(-1);

      ignoreRef.current = true;
    }
  }, [userProfile]);

  if (!userProfile) return <>권한이 없어 로그인 페이지로 이동합니다...</>;

  return (
    <div>
      <>{children}</>
    </div>
  );
};

export default Root;
