import { Link } from "react-router-dom";
import "./Navbar.css";
import type { NavbarElement } from "../router";
import { logout } from "../api/login";
import type { User } from "../types";

type Prop = {
  NavbarContent: NavbarElement[];
  userProfile: User | null;
  onSetUser: (args: string | null) => void;
};

const Navbar = ({ NavbarContent, userProfile, onSetUser }: Prop) => {
  const logoutHandler = async () => {
    const logoutResult = await logout();
    if (logoutResult === null) return;

    onSetUser(null);
  };
  return (
    <nav className="nav_nav">
      <ul className="nav_ul">
        {NavbarContent.map((router, idx) => (
          <li key={idx} className="nav_li">
            <Link className="nav_a" to={router.path}>
              {router.label}
            </Link>
          </li>
        ))}
        <li>
          {userProfile ? (
            <>{userProfile.first_name}님, 환영합니다.</>
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
            <div>
              <button onClick={logoutHandler}>로그아웃</button>
            </div>
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
