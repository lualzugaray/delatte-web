# Delatte Web ☕🌐

Delatte Web es la interfaz principal del proyecto **Delatte** para los usuarios finales. Esta aplicación permite descubrir cafeterías en Montevideo, explorar menús, dejar y leer reseñas, marcar favoritas y más.

---

## 🧑‍💻 Tecnologías

- **React** (con Vite)
- **TypeScript**
- **TailwindCSS**
- **React Router DOM**
- **Axios**
- **Auth0** (para login con Google)
- **Google Maps API**
- **Cloudinary** (para subida de imágenes)
- **React Icons**
- **React Toastify**
- **Swiper.js**

---

## 📁 Estructura del proyecto

delatte-web/
├── public/
├── src/
│ ├── assets/
│ ├── components/
│ │ ├── AdvancedFilters.jsx
│ │ ├── CafeMap.jsx
│ │ ├── FavoriteCafesCarousel.jsx
│ │ ├── FeaturedCafes.jsx
│ │ ├── Footer.jsx
│ │ ├── Layout.jsx
│ │ ├── Navbar.tsx
│ │ ├── QuickCategories.jsx
│ │ ├── ReviewForm.jsx
│ │ └── SyncUser.jsx
│ ├── pages/
│ │ ├── CafeDetails.jsx
│ │ ├── Explore.jsx
│ │ ├── Home.jsx
│ │ ├── Login.jsx
│ │ ├── Map.jsx
│ │ ├── MyCafe.jsx
│ │ ├── Profile.jsx
│ │ ├── Register.jsx
│ │ └── RegisterCafe.jsx
│ ├── services/
│ ├── styles/
│ ├── utils/
│ │ └── text.js
│ ├── App.jsx
│ ├── App.css
│ ├── index.css
│ └── main.jsx
├── .env.example
├── index.html
├── tailwind.config.js
└── vite.config.ts

## ⚙️ Variables de entorno

Para correr el proyecto correctamente, creá un archivo `.env` en la raíz basado en `.env.example` y completá con tus propias claves:

```
VITE_API_URL=.....
VITE_AUTH0_DOMAIN=.....
VITE_AUTH0_CLIENT_ID=.....
VITE_AUTH0_BACKEND_CLIENT_ID=.....
VITE_AUTH0_AUDIENCE=.....
VITE_GOOGLE_MAPS_KEY=.....
VITE_CLOUDINARY_URL=.....
VITE_CLOUDINARY_UPLOAD_PRESET=.....
```

> ⚠️ **Nunca subas el `.env` real al repositorio público.** Podés compartirlo por privado con quien necesite testear el proyecto.

---

## 🚀 Instalación desde cero

Si querés probar el proyecto en una computadora nueva, seguí estos pasos:

1. **Cloná el repositorio**
   git clone https://github.com/tu-usuario/delatte-web.git
   cd delatte-web

2. **Instalá dependencias**
    npm install

3. **Creá el archivo .env**
    cp .env.example .env
    Completá las variables de entorno en .env con tus credenciales de Auth0, Google Maps y la URL del backend (delatte-api).

4. **Levantá el servidor de desarrollo**
    npm run dev

5. **Abrí en tu navegador**
    Accedé a http://localhost:5173 para probar la aplicación.

🧭 Funcionalidades principales
🔍 Búsqueda avanzada de cafeterías con filtros
🗺️ Mapa interactivo con ubicación de cafés
🖼️ Visualización de fotos, menú y horarios
⭐ Guardar cafeterías favoritas
✍️ Dejar reseñas y sugerencias
👤 Registro e inicio de sesión con Google
🧑‍🍳 Sección exclusiva para managers de cafeterías
🧾 Carga de cafetería y gestión de contenido
📱 Diseño adaptable a dispositivos móviles

Hecho con 💛 por Lucía | © Delatte 2025