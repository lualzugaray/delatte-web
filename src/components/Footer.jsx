import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <nav className="footer-nav">
          <Link to="/">inicio</Link>
          <Link to="/sobre">sobre delatte</Link>
          <Link to="/contacto">contacto</Link>
        </nav>
      </div>
      <div className="footer-right">
      <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="instagram-icon"
        >
          <FaInstagram size={26} />
        </a>
        <span>Lucía Alzugaray, TFG 2025</span>
      </div>
    </footer>
  );
}
