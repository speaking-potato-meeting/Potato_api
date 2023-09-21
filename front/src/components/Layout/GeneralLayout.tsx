import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import { NavbarContent } from "../../router";

type GeneralLayoutProps = {};

export default function GeneralLayout() {
  return (
    <>
      <Navbar NavbarContent={NavbarContent} />
      <Outlet />
    </>
  );
}
