import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import logo from "../assets/logo.png";
import beans from "../assets/beans.png";

export default function Register() {
  const { loginWithRedirect } = useAuth0();
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    apellido: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="h-screen w-screen flex font-montserrat bg-background overflow-hidden">
      {/* Columna izquierda con logo y granos */}
      <div className="w-1/2 h-full relative p-6">
        <img src={logo} alt="Delatte Logo" className="w-10 h-20 object-contain" />

        <div className="h-full flex items-center justify-center">
          <img src={beans} alt="Coffee beans" className="w-[90%] max-h-[400px] object-contain mx-auto" />
        </div>
      </div>

      {/* Columna derecha con el formulario */}
      <div className="w-1/2 h-full flex flex-col items-center justify-center px-10">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-primary mb-2">¡unite a delatte!</h1>
          <p className="text-sm text-graySoft mb-6">registrate para continuar</p>

          {/* Botón de Google */}
          <div className="mb-4 flex justify-center">
            <button
              onClick={() => loginWithRedirect({ screen_hint: "signup" })}
              className="flex items-center justify-center bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100"
            >
              <img
                src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
                alt="Google"
                className="w-6 h-6"
              />
            </button>
          </div>

          <p className="text-sm text-graySoft mb-4 text-center">o usa tu correo electrónico</p>

          <form onSubmit={handleSubmit}>
            {[
              { type: "email", name: "email", placeholder: "correo electrónico" },
              { type: "text", name: "nombre", placeholder: "nombre" },
              { type: "text", name: "apellido", placeholder: "apellido" },
              { type: "password", name: "password", placeholder: "contraseña" },
              { type: "password", name: "confirmPassword", placeholder: "confirmar contraseña" },
            ].map(({ type, name, placeholder }) => (
              <div className="mb-4" key={name}>
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-full text-sm"
                  required
                />
              </div>
            ))}

            <div className="flex justify-center mb-6">
              <button
                type="submit"
                className="bg-primary text-white py-2 px-8 rounded-full text-sm hover:bg-primaryDark"
              >
                crear cuenta
              </button>
            </div>
          </form>

          <p className="text-sm text-graySoft text-center">
            ¿ya tenes una cuenta?{" "}
            <span
              onClick={() => loginWithRedirect()}
              className="text-primary underline cursor-pointer"
            >
              inicia sesión aquí
            </span>
          </p>

          <div className="mt-8 text-xs text-gray-400 text-center">
            © 2025 Delatte — hecho con ☕
          </div>
        </div>
      </div>
    </div>
  );
}
