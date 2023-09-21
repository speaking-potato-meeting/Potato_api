import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ NavbarContent }) => {
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
