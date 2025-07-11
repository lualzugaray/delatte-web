import "../styles/navbar.css";
import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="nav-group">
            <Link to="/">
                <img src="/logo.png" alt="Delatte logo" className="logo" />
            </Link>
                <nav className="nav-links">
                    <NavLink to="/explore" className={({ isActive }) => isActive ? "active" : ""}>explorar</NavLink>
                    <NavLink to="/map" className={({ isActive }) => isActive ? "active" : ""}>mapa</NavLink>
                    <NavLink to="/favorites" className={({ isActive }) => isActive ? "active" : ""}>favoritos</NavLink>
                    <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>perfil</NavLink>
                </nav>
            </div>
            <button className="login-button">iniciar sesión</button>
        </header>
    );
}
