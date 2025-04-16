import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import beans from "../assets/beans.png";
import "../styles/register.css";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    confirmPassword: ""
  });

  const [activeTab, setActiveTab] = useState("client");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Registro en Auth0
      const signupRes = await fetch(
        "https://dev-d82ap42lb6n7381y.us.auth0.com/dbconnections/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
            email: formData.email,
            password: formData.password,
            connection: "Username-Password-Authentication",
            name: `${formData.nombre} ${formData.apellido}`
          })
        }
      );

      if (!signupRes.ok) {
        const error = await signupRes.json();
        throw new Error(error.description || "Error al registrarse");
      }

      const tokenRes = await fetch(`${import.meta.env.VITE_API_URL}/auth0-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      
      const tokenData = await tokenRes.json();
      
      if (!tokenRes.ok) throw new Error(tokenData.error || "Error al loguearse con Auth0");
      
      const accessToken = tokenData.access_token;

      // 3. Sync con tu backend
      const payload = {
        email: formData.email,
        firstName: formData.nombre,
        lastName: formData.apellido,
        profilePicture: ""
      };

      const endpoint = activeTab === "manager" ? "/sync-manager" : "/sync-client";

      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.text(); // <-- si no es JSON
        console.error("Sync error:", errorData);
        throw new Error("Falló el sync con el backend");
      }      

      const data = await res.json();

      localStorage.setItem("jwt", data.token);

      // 4. Redireccionar según tipo
      navigate(activeTab === "manager" ? "/register-cafe" : "/explorar");
    } catch (err) {
      if (typeof err === "string") {
        setError(err);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado.");
      }    
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
          <h1>¡unite a delatte!</h1>

          {/* Tabs */}
          <div className="register-tabs">
            <button
              className={activeTab === "client" ? "active" : ""}
              onClick={() => setActiveTab("client")}
            >
              cliente
            </button>
            <button
              className={activeTab === "manager" ? "active" : ""}
              onClick={() => setActiveTab("manager")}
            >
              manager
            </button>
          </div>

          <p className="subtitle">registrate para continuar</p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            {["email", "nombre", "apellido", "password", "confirmPassword"].map((field) => (
              <input
                key={field}
                type={field.includes("password") ? "password" : "text"}
                name={field}
                placeholder={
                  field === "email"
                    ? "correo electrónico"
                    : field === "confirmPassword"
                    ? "confirmar contraseña"
                    : field
                }
                value={formData[field]}
                onChange={handleChange}
                required
              />
            ))}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
                ? "Creando cuenta..."
                : activeTab === "manager"
                ? "continuar registrando cafetería"
                : "crear cuenta"}
            </button>
          </form>

          <p className="login-link">
            ¿ya tenes una cuenta? <span>inicia sesión aquí</span>
          </p>

          <footer>© 2025 Delatte — hecho con ☕</footer>
        </div>
      </div>
    </div>
  );
}
