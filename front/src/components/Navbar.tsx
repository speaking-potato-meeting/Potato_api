import { Link } from "react-router-dom";
import "./Navbar.css";
import type { NavbarElement } from "../router";

type Prop = {
  NavbarContent: NavbarElement[];
  userProfile?: { user_id: number; username: string };
};

const Navbar = ({ NavbarContent, userProfile }: Prop) => {
  console.log(userProfile);

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
      </ul>
    </nav>
  );
};

export default Navbar;
