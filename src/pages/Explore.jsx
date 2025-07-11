// Explore.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import AdvancedFilters from "../components/AdvancedFilters";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FeaturedCafes from "../components/FeaturedCafes";

import "../styles/explore.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Explore() {
  const query = useQuery();
  const categoryFromQuery = query.get("category");
  const initialTextQuery = query.get("q") || "";
  const [search, setSearch] = useState(initialTextQuery);
  const navigate = useNavigate();

  const [cafes, setCafes] = useState([]);
  const [page, setPage] = useState(0);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("delatteFilters");
    if (saved) setFilters(JSON.parse(saved));
  }, []);

  const buildQueryString = (filtros, currentPage = 0) => {
    const params = new URLSearchParams();
    if (filtros?.selectedCategorias?.length) {
      params.append("categories", filtros.selectedCategorias.join(","));
    }
    if (filtros?.ratingMin) {
      params.append("ratingMin", filtros.ratingMin);
    }
    if (filtros?.sortBy) {
      params.append("sortBy", filtros.sortBy);
    }
    if (filtros?.openNow) {
      params.append("openNow", "true");
    }
    if (search) {
      params.append("q", search);
    }
    params.append("limit", limit);
    params.append("skip", currentPage * limit);
    return params.toString();
  };

  useEffect(() => {
    const fetchCafes = async () => {
      setLoading(true);
      try {
        const queryString = buildQueryString(filters, page);
        const url = categoryFromQuery
          ? `${import.meta.env.VITE_API_URL}/cafes?categories=${categoryFromQuery}`
          : `${import.meta.env.VITE_API_URL}/cafes?${queryString}`;
        const res = await axios.get(url);

        if (page === 0) {
          setCafes(Array.isArray(res.data) ? res.data : []);
        } else {
          setCafes((prev) => [
            ...prev,
            ...(Array.isArray(res.data) ? res.data : []),
          ]);
        }

        setHasMore(res.data.length === limit);
      } catch (err) {
        console.error("Error fetching cafés:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCafes();
  }, [filters, categoryFromQuery, page, search]); // ✅ <- Agregamos search acá

  const handleApplyFilters = (f) => {
    localStorage.setItem("delatteFilters", JSON.stringify(f));
    setPage(0);
    setFilters(f);
  };

  return (
    <div className="home">
    <>
      <Navbar />
      <div className="explore-container">
        <div className="explore-search-bar">
          <input
            type="text"
            placeholder="romántico, silencioso, calidad/precio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => {
              const newUrl = new URLSearchParams(window.location.search);
              newUrl.set("q", search);
              navigate(`/explore?${newUrl.toString()}`);
              setPage(0); // ✅ Reiniciar página cuando se hace nueva búsqueda
            }}
          >
            buscar 🔎
          </button>
        </div>

        <section className="explore-header">
          <h2>
            Explorar
            {categoryFromQuery && <span> para: {categoryFromQuery}</span>}
          </h2>
          <button className="advanced-btn" onClick={() => setShowModal(true)}>
            🔍 Búsqueda avanzada
          </button>
        </section>

        {Object.keys(filters).length > 0 && (
          <button
            className="clear-btn"
            onClick={() => {
              localStorage.removeItem("delatteFilters");
              setPage(0);
              setFilters({});
            }}
          >
            ❌ Limpiar filtros
          </button>
        )}

        {showModal && (
          <AdvancedFilters
            onClose={() => setShowModal(false)}
            onApply={handleApplyFilters}
          />
        )}

        {loading ? (
          <p className="explore-loading">Cargando cafeterías...</p>
        ) : cafes.length === 0 ? (
          Object.keys(filters).length > 0 || search ? (
            <div>
              <div className="explore-empty">
                <h3>No encontramos cafeterías con ese resultado 😓</h3>
                <p className="empty-subtext">Probá lo siguiente:</p>
                <ul className="empty-suggestions">
                  <li>Probá con otra palabra</li>
                  <li>Quitá algunos filtros</li>
                </ul>
              </div>
              <FeaturedCafes />
            </div>
          ) : (
            <div className="explore-welcome">
              <h3>¿Buscando un buen café? ☕</h3>
              <p className="empty-subtext">
                Usá los filtros para encontrar cafeterías según tus gustos :)
              </p>
              <button
                className="advanced-btn"
                onClick={() => setShowModal(true)}
              >
                Probar búsqueda avanzada
              </button>
            </div>
          )
        ) : (
          <div className="explore-grid">
            {cafes.map((cafe) => (
              <div className="cafe-card" key={cafe._id}>
                <div className="cafe-options-wrapper">
                  <Link
                    to={`/cafes/${cafe._id}`}
                    className="cafe-options-icon"
                    title="Ver detalles"
                  >
                    <span className="material-symbols-outlined">
                      arrow_outward
                    </span>
                  </Link>
                </div>
                <img
                  src={
                    cafe.coverImage || cafe.gallery?.[0] || "/default-cafe.jpg"
                  }
                  alt={cafe.name}
                  onError={(e) => {
                    e.target.src = "/default-cafe.jpg";
                  }}
                />
                <div className="cafe-info">
                  <h4>{cafe.name}</h4>
                  <p className="cafe-desc">{cafe.description}</p>
                  <p className="cafe-rating">
                    {"★"
                      .repeat(Math.round(cafe.averageRating || 0))
                      .padEnd(5, "☆")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMore && !loading && (
          <div className="explore-more-container">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="explore-more-btn"
            >
              Ver más resultados
            </button>
          </div>
        )}
      </div>
    </>
    </div>
  );
}
