import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import AdvancedFilters from "../components/AdvancedFilters";
import "../styles/explore.css";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function Explore() {
    const query = useQuery();
    const categoryFromQuery = query.get("category");

    const [cafes, setCafes] = useState([]);
    const [page, setPage] = useState(0); // nueva página
    const limit = 10;
    const [hasMore, setHasMore] = useState(true); // para saber si hay más
    const [filters, setFilters] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false); // también lo estás usando

    useEffect(() => {
        const saved = localStorage.getItem("delatteFilters");
        if (saved) {
            const parsed = JSON.parse(saved);
            setFilters(parsed);
        }
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
                    ? `/api/cafes?categories=${categoryFromQuery}`
                    : `/api/cafes?${queryString}`;
                const res = await axios.get(url);

                if (page === 0) {
                    setCafes(Array.isArray(res.data) ? res.data : []);
                } else {
                    setCafes((prev) => [
                        ...prev,
                        ...(Array.isArray(res.data) ? res.data : []),
                    ]);
                }                

                setHasMore(res.data.length === limit); // si trajo menos que el límite, ya no hay más
            } catch (err) {
                console.error("Error fetching cafés:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCafes();
    }, [filters, categoryFromQuery, page]);

    const handleApplyFilters = (f) => {
        localStorage.setItem("delatteFilters", JSON.stringify(f));
        setFilters(f);
    };


    return (
        <>
            <Navbar />
            <div className="explore-container">
                <section className="explore-header">
                    <h2>
                        Resultados
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
                    <p className="explore-empty">
                        {filters.openNow
                            ? "No hay cafeterías abiertas en este momento ☕⏰"
                            : "No encontramos cafeterías con esos filtros 😓"}
                    </p>
                ) : (
                    <div className="explore-grid">
                        {cafes.map((cafe) => (
                            <div className="cafe-card" key={cafe._id}>
                                <img
                                    src={cafe.gallery?.[0] || "/default-cafe.jpg"}
                                    alt={cafe.name}
                                />
                                <h4>{cafe.name}</h4>
                                <p>{cafe.description}</p>
                                <p className="rating">
                                    {"★".repeat(Math.round(cafe.averageRating || 0))}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
                {hasMore && !loading && (
                    <div className="explore-more-container">
                        <button onClick={() => setPage((prev) => prev + 1)} className="explore-more-btn">
                            Ver más resultados
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
