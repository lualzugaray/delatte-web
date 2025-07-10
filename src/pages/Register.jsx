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
  const [stage, setStage] = useState("form"); // 'form' o 'verify'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Registrar en Auth0
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
        const errorData = await signupRes.json();

        if (
          errorData.code === "invalid_signup" &&
          errorData.description === "Invalid sign up"
        ) {
          setError(
            "Este correo ya está registrado. Iniciá sesión para registrar tu cafetería."
          );
        } else {
          setError(errorData.description || "Ocurrió un error al registrarte.");
        }

        return;
      }

      // 2. Mostrar pantalla de verificación para ambos roles
      setStage("verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSync = async () => {
    setError(null);
    setLoading(true);

    try {
      // 1. Login para obtener el token
      const loginRes = await fetch("https://dev-d82ap42lb6n7381y.us.auth0.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "password",
          username: formData.email,
          password: formData.password,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
          client_secret: import.meta.env.VITE_AUTH0_CLIENT_SECRET
        })
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginData.error_description || "Error al iniciar sesión");

      const token = loginData.access_token;
      localStorage.setItem("token", token);

      // 2. Sync con backend según rol
      const syncEndpoint =
        activeTab === "manager"
          ? `${import.meta.env.VITE_API_URL}/sync-manager`
          : `${import.meta.env.VITE_API_URL}/sync-client`;

      const syncRes = await fetch(syncEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.nombre,
          lastName: formData.apellido,
          profilePicture: ""
        })
      });

      if (!syncRes.ok) {
        const error = await syncRes.json();
        throw new Error(error.message || "Error al sincronizar usuario");
      }

      // 3. Redirección
      if (activeTab === "manager") {
        navigate("/register-cafe");
      } else {
        navigate("/explore");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
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

          <div className="register-tabs">
            <button
              className={activeTab === "client" ? "active" : ""}
              onClick={() => { setActiveTab("client"); setStage("form"); }}
            >
              cliente
            </button>
            <button
              className={activeTab === "manager" ? "active" : ""}
              onClick={() => { setActiveTab("manager"); setStage("form"); }}
            >
              manager
            </button>
          </div>

          <p className="subtitle">registrate para continuar</p>
          {activeTab === "manager" && (
            <div className="info-box">
              <p>
                <strong>¿Sos el encargado de una cafetería?</strong><br />
                Para poder registrar tu café en Delatte, primero necesitamos que crees tu cuenta como <strong>usuario manager</strong>.
              </p>
              <p>
                Una vez que completes este formulario, te llevaremos automáticamente al registro de tu cafetería. 😊
              </p>
            </div>
          )}

          {error && <p className="error">{error}</p>}

          {stage === "form" && (
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
                    ? "crear cuenta de manager"
                    : "crear cuenta"}
              </button>
            </form>
          )}

          {stage === "verify" && (
            <div className="verify-box">
              <p className="success">
                🎉 Te registraste como {activeTab}.<br />
                Verificá tu email para continuar.
              </p>
              <button
                onClick={handleVerifyAndSync}
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "Verificando..." : "ya verifiqué mi email"}
              </button>
            </div>
          )}

          <p className="login-link">
            ¿ya tenes una cuenta? <span onClick={() => navigate("/login")}>inicia sesión aquí</span>
          </p>

          <footer>© 2025 Delatte — hecho con ☕</footer>
        </div>
      </div>
    </div>
  );
}
