import "./Header.scss";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
          <Link to="/" className="header__brand-name">PriceTag</Link>
        </div>
        <nav className="header__nav">
          <Link to="/get-a-quote" className="header__nav-cta">Get A Quote</Link>
        </nav>
      </div>
    </header>
  );
}