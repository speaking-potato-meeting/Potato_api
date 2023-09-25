import { Link } from "react-router-dom";
import "./Navbar.css";
import type { NavbarElement } from "../router";

type Prop = {
  NavbarContent: NavbarElement[];
  userProfile?: { user_id: number; username: string };
};

const Navbar = ({ NavbarContent, userProfile }: Prop) => {
  const navbarLists = () => {
    /* 유저 프로필이 있을 때, */
    if (userProfile) return NavbarContent;

    return NavbarContent.filter((r) => !r.withAuth);
  };
  return (
    <nav className="nav_nav">
      <ul className="nav_ul">
        {navbarLists().map((router, idx) => (
          <li key={idx} className="nav_li">
            <Link className="nav_a" to={router.path}>
              {router.label}
            </Link>
          </li>
        ))}
        <li>
          {userProfile ? (
            <>{userProfile.username}님, 환영합니다.</>
          ) : (
            <>
              {" "}
              <Link className="nav_a" to={"/account/login"}>
                로그인
              </Link>
            </>
          )}
        </li>
        <li>
          {userProfile ? (
            <></>
          ) : (
            <>
              <Link className="nav_a" to={"/account/signup"}>
                회원가입
              </Link>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
