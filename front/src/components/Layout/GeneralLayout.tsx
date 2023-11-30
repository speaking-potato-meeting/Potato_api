import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import { NavbarContent } from "../../router";

/* React-Query */
import { useUserQuery } from "../../hooks/useUserQuery";
import Tictoc from "../Timer/Tictoc";
import CurrentUserContextProvider from "../../context/CurrentUserContextProvider";

export default function GeneralLayout() {
  const userQuery = useUserQuery();

  // const user = useCurrentUserContext();

  const navbarLists = () => {
    /* 유저 프로필이 있을 때, */
    if (userQuery.data) {
      return NavbarContent;
    }

    return NavbarContent.filter((r) => !r.withAuth);
  };

  return (
    <>
      <CurrentUserContextProvider>
        <Navbar NavbarContent={navbarLists()} />
        <Outlet />
        {(userQuery.isSuccess && userQuery.data) ? <Tictoc/> : <></>}
      </CurrentUserContextProvider>
    </>
  );
}
