import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import { useState } from "react";
import "../styles/footer.css";

export default function Footer() {
  const [showAbout, setShowAbout] = useState(false);
  const isTouchDevice = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  return (
    <footer className="footer">
      <div className="footer-left">
        <nav className="footer-nav">
          <Link to="/">inicio</Link>
          <span
            className="footer-link"
            onMouseEnter={!isTouchDevice ? () => setShowAbout(true) : undefined}
            onMouseLeave={!isTouchDevice ? () => setShowAbout(false) : undefined}
            onClick={isTouchDevice ? () => setShowAbout(!showAbout) : undefined}
          >
            sobre delatte
            {showAbout && (
              <div className="footer-modal">
                <p>
                  Delatte nació de una necesidad personal: encontrar cafeterías que encajaran con mis momentos, mis gustos y mis planes. No había un lugar específico que organizara esa información... así que lo creé.
                </p>
                <p>
                  Soy Lucía Alzugaray, estudiante de la Escuela Da Vinci, y esta es mi tesis de grado. Delatte busca facilitar tu búsqueda, visibilizar a pequeños emprendimientos y conectar personas con lugares donde quedarse un ratito más.
                </p>
              </div>
            )}
          </span>
          <a href="mailto:luciaalzugaray@gmail.com" className="footer-link">
            contacto
          </a>
        </nav>
      </div>

      <div className="footer-right">
        <div className="tooltip-wrapper">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="instagram-icon"
          >
            <FaInstagram size={26} />
          </a>
          <span className="tooltip-text">Próximamente</span>
        </div>

        <span>Lucía Alzugaray, TFG 2025</span>
      </div>
    </footer>
  );
}
