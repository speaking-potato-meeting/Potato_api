import { Link } from "react-router-dom";
import "./Navbar.css";
import type { NavbarElement } from "../router";
import { logout } from "../api/login";
import { useMutation, useQueryClient } from "react-query";
import { useCurrentUserContext } from "../context/CurrentUserContextProvider";

type Prop = {
  NavbarContent: NavbarElement[];
};

const Navbar = ({ NavbarContent }: Prop) => {
  const queryClient = useQueryClient();

  const data = useCurrentUserContext();

  const mutation = useMutation(logout, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    },
  });

  const logoutHandler = async () => {
    mutation.mutate();
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
          {data ? (
            <>{data.first_name}님, 환영합니다.</>
          ) : (
            <>
              <Link className="nav_a" to={"/account/login"}>
                로그인
              </Link>
            </>
          )}
        </li>
        <li>
          <>
            {data ? (
              <div>
                <button onClick={logoutHandler}>로그아웃</button>
              </div>
            ) : (
              <Link className="nav_a" to={"/account/signup"}>
                회원가입
              </Link>
            )}
          </>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
