# Delatte Web ☕🌐

Delatte Web es la interfaz principal del proyecto Delatte para los usuarios finales. Esta aplicación permite a los clientes descubrir cafeterías en Montevideo, ver menús, leer y dejar reseñas, guardar favoritos y más.

## 🧑‍💻 Tecnologías

- **React** (con Vite)
- **TypeScript**
- **TailwindCSS**
- **React Router DOM**
- **Axios**
- **Auth0** (para login con Google)
- **Google Maps API**

## 📁 Estructura inicial

```
delatte-web/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── App.tsx
├── .env.example
├── index.html
├── tailwind.config.js
└── vite.config.ts
```

## ⚙️ Variables de entorno

Crea un archivo `.env` basado en `.env.example` y completalo con tus credenciales:

```
VITE_API_URL=https://delatte-api.example.com
VITE_AUTH0_DOMAIN=...
VITE_AUTH0_CLIENT_ID=...
VITE_GOOGLE_MAPS_API_KEY=...
```

> ⚠️ No subas nunca tu `.env` al repositorio público.

## 🏁 Scripts disponibles

```bash
npm install      # Instala dependencias
npm run dev      # Ejecuta el servidor de desarrollo
npm run build    # Crea la versión optimizada para producción
npm run preview  # Previsualiza la versión de producción
```

## 🧭 Funcionalidades previstas

- Búsqueda de cafeterías con filtros
- Vista de mapa interactivo
- Ver menú, fotos y reseñas de cada café
- Iniciar sesión con Google
- Agregar favoritos
- Dejar reseñas y sugerencias

Hecho con 💛 por Lucía
