import { Outlet, useOutletContext } from "react-router-dom";
import Navbar from "../Navbar";
import { NavbarContent } from "../../router";
import { useState } from "react";
import type { User } from "../../types";

type GeneralLayoutProps = {};

type ContextType = {
  userProfile: { user_id: number; username: string } | null;
  setUserProfile: (user: { user_id: number; username: string }) => void;
};

export default function GeneralLayout() {
  const [userProfile, setUserProfile] = useState<{
    user_id: number;
    username: string;
  }>();
  const onSetUser = (args) => {
    setUserProfile(args);
  };

  return (
    <>
      <Navbar NavbarContent={NavbarContent} userProfile={userProfile} />
      <Outlet context={[onSetUser]} />
    </>
  );
}
export function useUser() {
  return useOutletContext<ContextType>();
}
