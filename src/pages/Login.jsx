import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import beans from "../assets/beans.png";
import "../styles/register.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.emailSent) {
      const timer = setTimeout(() => {
        navigate(location.pathname, { replace: true, state: {} });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Login
      const tokenRes = await fetch(`${import.meta.env.VITE_API_URL}/auth0-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) throw new Error(tokenData.error || "Error al iniciar sesión");

      const token = tokenData.access_token;
      localStorage.setItem("token", token);
      console.log(token)

      // 2. Obtener rol
      const userRes = await fetch(`${import.meta.env.VITE_API_URL}/users/role`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      if (!userRes.ok) throw new Error(userData.error || "Error al obtener rol del usuario");

      const role = userData.role;

      // 3. Lógica para manager
      if (role === "manager") {
        if (!userData.emailVerified) {
          navigate("/verify-email");
          return;
        }

        // 4. Verificar si ya tiene café registrado
        const cafeRes = await fetch(`${import.meta.env.VITE_API_URL}/managers/me/cafe`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (cafeRes.status === 404) {
          navigate("/register-cafe");
        } else if (cafeRes.ok) {
          navigate("/dashboard");
        } else {
          const cafeData = await cafeRes.json();
          throw new Error(cafeData.error || "Error al verificar el café");
        }

        return;
      }

      // Otros roles si hubiera
      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <img src={logo} alt="Logo Delatte" className="register-logo" />
        <img src={beans} alt="Coffee beans" className="register-beans" />
      </div>

      <div className="register-right">
        <div className="register-box">
          <h1>hola!</h1>
          <p className="subtitle">iniciá sesión para continuar</p>

          {location.state?.emailSent && (
            <p className="success">
              ✉️ Te enviamos un email para verificar tu cuenta.
            </p>
          )}

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Ingresando..." : "iniciar sesión"}
            </button>
          </form>

          <p className="login-link">
            ¿no tenes una cuenta? <span onClick={() => navigate("/register")}>registrate aquí</span>
          </p>

          <footer>© 2025 Delatte — hecho con ☕</footer>
        </div>
      </div>
    </div>
  );
}
