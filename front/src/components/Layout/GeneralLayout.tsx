import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import { NavbarContent } from "../../router";
import { useEffect } from "react";
import { getUser } from "../../api/signup";
import BottomTictoc from "../Timer/BottomTictoc";

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

  const isStopWatch = currentPath.pathname === '/stop-watch';

  return (
    <>
      <Navbar NavbarContent={NavbarContent} />
      <Outlet />
      {!isStopWatch && <BottomTictoc/>}
    </>
  );
}