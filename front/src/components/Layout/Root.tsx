import { useNavigate, useOutletContext } from "react-router-dom";
import { getCurrentUserInfo } from "../../api/login";
import { useEffect } from "react";
import { useUser } from "./GeneralLayout";
// import type {User} from '../../types'

interface RootProps {
  children: React.ReactNode;
}

const Root = ({ children }: RootProps) => {
  const navigate = useNavigate();
  // const { setUserProfile } = useUser();
  const [onSetUser] = useOutletContext<{ user_id: number; username: string }>();
  console.log(onSetUser);

  const fetchUserProfile = async () => {
    const userProfileResponse = await getCurrentUserInfo();

    if (userProfileResponse === null) {
      return (
        confirm("로그인이 필요합니다. 로그인 하시겠습니까?") &&
        navigate("/account/login")
      );
    }

    onSetUser(userProfileResponse);
  };

  useEffect(() => {
    // console.log("권한이 필요한 페이지가 바뀌었습니다.");
    fetchUserProfile();
  }, [children]);

  return (
    <div>
      <>{children}</>
    </div>
  );
};

export default Root;
