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

  if (userProfile === null) return <>Loading...</>;

  return (
    <div>
      <>{children}</>
    </div>
  );
};

export default Root;
