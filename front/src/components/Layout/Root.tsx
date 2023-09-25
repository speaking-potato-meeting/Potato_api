import { useNavigate, useOutletContext } from "react-router-dom";
import { getCurrentUserInfo } from "../../api/login";
import { useEffect } from "react";
import { useUser } from "./GeneralLayout";
// import type {User} from '../../types'

interface RootProps {
  children: React.ReactNode;
}

const Root = ({ children }: RootProps) => {
  // const { setUserProfile } = useUser();
  const [userProfile, onSetUser] = useOutletContext<{
    user_id: number;
    username: string;
  }>();
  // console.log(onSetUser);
  // console.log(userProfile);
  console.log(useOutletContext());

  return (
    <div>
      <>{children}</>
    </div>
  );
};

export default Root;
