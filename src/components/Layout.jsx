import { Link, Outlet } from "react-router-dom";
import { SyncUser } from "../components/SyncUser";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        {/* <h1 className="text-xl font-bold text-gray-800">Delatte ☕</h1>
        <nav className="space-x-4">
          <Link to="/" className="text-blue-600 hover:underline">Inicio</Link>
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          <Link to="/register" className="text-blue-600 hover:underline">Registrarse</Link>
          <Link to="/profile" className="text-blue-600 hover:underline">Perfil</Link>
        </nav> */}
      </header>

      <main className="flex-grow p-4">
      </main>
{/* 
      <footer className="bg-gray-100 text-center text-sm text-gray-500 py-2">
        © 2025 Delatte — hecho con ☕
      </footer> */}
    </div>
  );
}
