import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import { NavbarContent } from "../../router";
import { useEffect } from "react";
import { getUser } from "../../api/signup";

type GeneralLayoutProps = {};

export default function GeneralLayout() {
  const fetchUser = async () => {
    const userRes = await getUser();
    return userRes;
  };

  let currentPath = useLocation();
  useEffect(() => {
    fetchUser();
  }, [currentPath]);

  return (
    <>
      <Navbar NavbarContent={NavbarContent} />
      <Outlet />
    </>
  );
}
