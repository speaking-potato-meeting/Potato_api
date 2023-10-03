import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import Navbar from "../Navbar";
import { NavbarContent } from "../../router";
import { useState, useEffect } from "react";
import type { User } from "../../types";
import { getCurrentUserInfo } from "../../api/login";

type ContextType = {
  userProfile: { user_id: number; username: string } | null;
  setUserProfile: (user: { user_id: number; username: string }) => void;
};

export default function GeneralLayout({}) {
  const [userProfile, setUserProfile] = useState<User | null>(null);

  let location = useLocation();

  const navbarLists = () => {
    /* 유저 프로필이 있을 때, */
    if (userProfile) return NavbarContent;

    return NavbarContent.filter((r) => !r.withAuth);
  };

  useEffect(() => {
    let ignore = false;

    const fetchUserProfile = async () => {
      const userProfileResponse = await getCurrentUserInfo();

      /* 한 번만 상태 setter하는 로직 */
      if (!ignore && userProfileResponse) {
        setUserProfile(userProfileResponse);
      }
    };
    fetchUserProfile();

    return () => {
      ignore = true;
    };
  }, [location]);

  // if (!userProfile) return <div>정보를 불러오는 중입니다...</div>;

  const onSetUser = (args: string | null) => {
    setUserProfile(args);
  };

  return (
    <>
      <Navbar
        NavbarContent={navbarLists()}
        userProfile={userProfile}
        onSetUser={onSetUser}
      />
      <Outlet context={{ userProfile, onSetUser }} />
    </>
  );
}
export function useUser() {
  return useOutletContext<ContextType>();
}
