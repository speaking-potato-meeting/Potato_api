import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import Navbar from "../Navbar";
import { NavbarContent } from "../../router";
import { useState, useEffect } from "react";
import type { User } from "../../types";
import { getCurrentUserInfo } from "../../api/login";

type ContextType = {
  userProfile: { user_id: number; username: string } | null;
  setUserProfile: (user: { user_id: number; username: string }) => void;
};

export default function GeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userProfile, setUserProfile] = useState<{
    user_id: number;
    username: string;
  } | null>(null);

  const authUser = {
    user_id: 3,
    username: "도은호",
  };

  const navbarLists = () => {
    /* 유저 프로필이 있을 때, */
    if (userProfile) return NavbarContent;

    return NavbarContent.filter((r) => !r.withAuth);
  };

  const fetchUserProfile = async () => {
    const userProfileResponse = await getCurrentUserInfo();

    /* 테스트 유저 */
    if (
      userProfileResponse &&
      userProfileResponse.user_id === authUser.user_id &&
      userProfileResponse.username === authUser.username
    ) {
      setUserProfile(userProfileResponse);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [children]);

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
