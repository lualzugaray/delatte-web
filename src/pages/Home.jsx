import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/home.css";
import Navbar from "../components/Navbar";
import QuickCategories from "../components/QuickCategories";
import FeaturedCafes from "../components/FeaturedCafes";
import CafeMap from "../components/CafeMap";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [cafes, setCafes] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/cafes`)
      .then((res) => {
        console.log("📍 Tipo de respuesta:", typeof res.data);
        console.log("📍 Respuesta completa:", res.data);

        if (Array.isArray(res.data)) {
          res.data.forEach((cafe) => {
            console.log(cafe.name, cafe.location);
          });
          setCafes(res.data);
        } else {
          console.error("❌ La respuesta no es un array:", res.data);
        }
      })

      .catch((err) => console.error("Error loading cafes:", err));
  }, []);

  return (
    <div className="home">
      <>
        <Navbar />
        <div className="home">
          <section className="search-section">
            <div className="banner-left">
              <h2>
                buscando dónde<br />
                tomar tu cafecito hoy?
              </h2>
              <p>te ayudamos a encontrar el lugar perfecto ;)</p>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="romántico, silencioso, calidad/precio..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={() => navigate(`/explore?q=${encodeURIComponent(search)}`)}>

                  buscar 🔎
                </button>
              </div>
            </div>
            <div className="banner-right">
              <img src="/cup.png" alt="Café" className="coffee-img" />
              <img src="/beans.png" alt="Beans" className="beans-img" />
            </div>
          </section>

          <section>
            <QuickCategories />
          </section>

          <section>
            <FeaturedCafes />
          </section>

          <section className="map-section">
            <CafeMap cafes={cafes} />
          </section>

          <Footer />

        </div></>
    </div>
  );

}

