import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import { NavbarContent } from "../../router";
import { useEffect } from "react";

type GeneralLayoutProps = {};

export default function GeneralLayout() {
  return (
    <>
      <Navbar NavbarContent={NavbarContent} />
      <Outlet />
    </>
  );
}
