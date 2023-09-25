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
  } | null>();

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
    fetchUserProfile();
  }, [children]);

  const onSetUser = (args) => {
    setUserProfile(args);
  };

  return (
    <>
      <Navbar NavbarContent={NavbarContent} userProfile={userProfile} />
      <Outlet context={[userProfile, onSetUser]} />
    </>
  );
}
export function useUser() {
  return useOutletContext<ContextType>();
}
