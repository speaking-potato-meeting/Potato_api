import { useNavigate, useOutletContext } from "react-router-dom";
import { getCurrentUserInfo } from "../../api/login";
import { useEffect } from "react";
import { useUser } from "./GeneralLayout";
// import type {User} from '../../types'

interface RootProps {
  children: React.ReactNode;
}

const Root = ({ children }: RootProps) => {
  const { userProfile } = useOutletContext<{
    userProfile: { user_id: number; username: string };
    onSetUser: () => void;
  }>();

  const navigate = useNavigate();

  if (userProfile === null) {
    {
      if (confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"))
        return navigate("/account/login");
      return navigate(-1);
    }
  }

  return (
    <div>
      <>{children}</>
    </div>
  );
};

export default Root;
