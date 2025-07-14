import "../styles/navbar.css";
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") ?? "{}");
    const isLoggedIn = !!user?.role;
    const role = user?.role;

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };
    
    return (
        <header className="navbar">
            <div className="nav-group">
                <Link to="/">
                    <img src="/logo.png" alt="Delatte logo" className="logo" />
                </Link>

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
            </div>

            <div>
                {!isLoggedIn ? (
                    <NavLink to="/login" className="login-button">iniciar sesión</NavLink>
                ) : (
                    <NavLink to="/" onClick={handleLogout} className="login-button">cerrar sesión</NavLink>
                )}
            </div>
        </header>
    );
}
