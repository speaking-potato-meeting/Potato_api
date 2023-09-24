import { useNavigate } from "react-router-dom";
import { getCurrentUserInfo } from "../../api/login";
import { useState, useEffect } from "react";
// import type {User} from '../../types'

interface RootProps {
  children: React.ReactNode;
}

const Root = ({ children }: RootProps) => {
  const [userProfile, setUserProfile] = useState<{
    user_id: number;
    username: string;
  }>();
  const navigate = useNavigate();
  const fetchUserProfile = async () => {
    const userProfileResponse = await getCurrentUserInfo();

    if (userProfileResponse === null) {
      return (
        confirm("로그인이 필요합니다. 로그인 하시겠습니까?") &&
        navigate("/account/login")
      );
    }

    setUserProfile(userProfileResponse);
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
