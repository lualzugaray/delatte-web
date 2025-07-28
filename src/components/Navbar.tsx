import "../styles/navbar.css";
import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") ?? "{}");
    const isLoggedIn = !!user?.role;
    const role = user?.role;

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <header className="navbar">
            <div className="nav-group">
                <Link to="/">
                    <img src="/logo.png" alt="Delatte logo" className="logo" />
                </Link>

                {!isMobile ? (
                    <nav className="nav-links">
                        <NavLink to="/explore" className={({ isActive }) => isActive ? "active" : ""}>explorar</NavLink>
                        <NavLink to="/map" className={({ isActive }) => isActive ? "active" : ""}>mapa</NavLink>
                        {isLoggedIn && role === "manager" && (
                            <NavLink to="/my-cafe" className={({ isActive }) => isActive ? "active" : ""}>mi cafetería</NavLink>
                        )}
                        {isLoggedIn && role === "client" && (
                            <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>perfil</NavLink>
                        )}
                    </nav>
                ) : (
                    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
                )}
            </div>

            {!isMobile ? (
                <div>
                    {!isLoggedIn ? (
                        <NavLink to="/login" className="login-button">iniciar sesión</NavLink>
                    ) : (
                        <NavLink to="/" onClick={handleLogout} className="login-button">cerrar sesión</NavLink>
                    )}
                </div>
            ) : (
                menuOpen && (
                    <div className="mobile-menu">
                        <NavLink to="/explore" onClick={() => setMenuOpen(false)}>explorar</NavLink>
                        <NavLink to="/map" onClick={() => setMenuOpen(false)}>mapa</NavLink>
                        {isLoggedIn && role === "manager" && (
                            <NavLink to="/my-cafe" onClick={() => setMenuOpen(false)}>mi cafetería</NavLink>
                        )}
                        {isLoggedIn && role === "client" && (
                            <NavLink to="/profile" onClick={() => setMenuOpen(false)}>perfil</NavLink>
                        )}
                        {!isLoggedIn ? (
                            <NavLink to="/login" className="login-button" onClick={() => setMenuOpen(false)}>iniciar sesión</NavLink>
                        ) : (
                            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="login-button">cerrar sesión</button>
                        )}
                    </div>
                )
            )}
        </header>
    );
}
