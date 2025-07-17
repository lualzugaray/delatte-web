import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import AdvancedFilters from "../components/AdvancedFilters";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FeaturedCafes from "../components/FeaturedCafes";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/explore.css";
import { normalizeText } from "../utils/text";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function Explore() {
    const query = useQuery();
    const categoryFromQuery = query.get("category");
    const initialTextQuery = query.get("q") || "";
    const [search, setSearch] = useState(initialTextQuery);
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [cafes, setCafes] = useState([]);
    const [page, setPage] = useState(0);
    const limit = 10;
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") ?? "{}");

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
            params.append("q", normalizeText(search));
        }
        params.append("limit", limit);
        params.append("skip", currentPage * limit);
        return params.toString();
    };

    useEffect(() => {
        const fetchCafes = async () => {
            setLoading(true);
            try {
                if (categoryFromQuery && !filters.selectedCategorias?.includes(categoryFromQuery)) {
                    filters.selectedCategorias = [categoryFromQuery];
                }
                const queryString = buildQueryString(filters, page);
                const url = `${import.meta.env.VITE_API_URL}/cafes?${queryString}`;
                const res = await axios.get(url);

                if (page === 0) {
                    setCafes(Array.isArray(res.data) ? res.data : []);
                } else {
                    setCafes(prev => [...prev, ...(Array.isArray(res.data) ? res.data : [])]);
                }
                setHasMore(Array.isArray(res.data) && res.data.length === limit);
            } catch (err) {
                toast.error("Error al cargar cafeterías. Por favor, inténtalo de nuevo.");
            } finally {
                setLoading(false);
            }
        };

        fetchCafes();
    }, [filters, categoryFromQuery, page, search]);

    const handleApplyFilters = f => {
        localStorage.setItem("delatteFilters", JSON.stringify(f));
        setPage(0);
        setFilters(f);
    };

    useEffect(() => {
        if (user && user.role === "client") {
            if (token) {
                axios
                    .get(`${import.meta.env.VITE_API_URL}/clients/me/favorites`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    .then(res => setFavorites(res.data))
                    .catch(() =>
                        toast.error("No se pudieron cargar tus favoritos. Por favor, vuelve a intentarlo.")
                    );
            }
        }
    }, [token]);

    const handleFavorite = (cafeId, e) => {
        e.stopPropagation();
        if (!token) return navigate("/login");

        const isFav = favorites.some(f => f._id === cafeId);
        const method = isFav ? axios.delete : axios.post;
        const url = `${import.meta.env.VITE_API_URL}/clients/me/favorites/${cafeId}`;
        const config = isFav
            ? { headers: { Authorization: `Bearer ${token}` } }
            : [{}, { headers: { Authorization: `Bearer ${token}` } }];

        method(url, ...config)
            .then(() => {
                if (isFav) {
                    setFavorites(favorites.filter(f => f._id !== cafeId));
                    toast.info("Café removido de favoritos.");
                } else {
                    setFavorites([...favorites, { _id: cafeId }]);
                    toast.success("Café agregado a favoritos.");
                }
            })
            .catch(() =>
                toast.error(
                    isFav
                        ? "No se pudo remover el favorito. Intenta de nuevo."
                        : "No se pudo agregar a favoritos. Recuerda que solo un cliente registrado puede tener cafeterías favoritas :)"
                )
            );
    };

    const renderStars = (averageRating = 0) => {
        const fullStars = Math.floor(averageRating);
        const hasHalfStar = averageRating % 1 >= 0.25 && averageRating % 1 < 0.75;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        const stars = [];

        for (let i = 0; i < fullStars; i++) stars.push("star");
        if (hasHalfStar) stars.push("star_half");
        for (let i = 0; i < emptyStars; i++) stars.push("star_border");

        return stars.map((icon, i) => (
            <span key={i} className="material-icons">
                {icon}
            </span>
        ));
    };

    return (
        <div className="home">
            <>
                <Navbar />
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    draggable
                />
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
                                const qn = normalizeText(search);
                                navigate(`/explore?q=${qn}`);
                                setPage(0);
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
                    </section>

                    {(Object.keys(filters).length > 0 || search) && (
                        <div className="clear-btn-container">
                            <button
                                className="clear-btn"
                                onClick={() => {
                                    localStorage.removeItem("delatteFilters");
                                    setPage(0);
                                    setFilters({});
                                    setSearch("");
                                    const newUrl = new URLSearchParams(window.location.search);
                                    newUrl.delete("q");
                                    newUrl.delete("category");
                                    navigate(`/explore?${newUrl.toString()}`);
                                }}
                            >
                                ❌ Limpiar filtros
                            </button>
                        </div>
                    )}

                    {showModal && (
                        <AdvancedFilters
                            onClose={() => setShowModal(false)}
                            onApply={handleApplyFilters}
                        />
                    )}

                    {loading && page === 0 ? (
                        <div className="spinner" />
                    ) : cafes.length === 0 ? (
                        Object.keys(filters).length > 0 || search ? (
                            <div>
                                <div className="explore-empty">
                                    <h3>No encontramos cafeterías con ese resultado 😓</h3>
                                    <p className="empty-subtext">
                                        Probá otra palabra o quizá algún otro filtro!
                                    </p>
                                </div>
                                <FeaturedCafes />
                            </div>
                        ) : (
                            <div>
                                <div className="explore-empty">
                                    <h3>¿Buscando un buen café? ☕</h3>
                                    <p className="empty-subtext">
                                        Usá los filtros para encontrar cafeterías según tus gustos :)
                                    </p>
                                </div>
                                <FeaturedCafes />
                            </div>
                        )
                    ) : (
                        <div className="explore-grid">
                            {cafes.map(cafe => (
                                <div className="cafe-card" key={cafe._id} onClick={e => e.stopPropagation()}>
                                    <div className="cafe-options-wrapper">
                                        <button
                                            className={`favorite-btn ${favorites.some(f => f._id === cafe._id) ? "favorited" : ""
                                                }`}
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleFavorite(cafe._id, e);
                                            }}
                                        >
                                            <span className="material-icons" style={{
                                                color: "#6B4226",
                                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                                borderRadius: "50%",
                                                width: "32px",
                                                height: "32px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                textDecoration: "none",
                                                fontSize: "20px",
                                                transition: "background 0.2s ease, transform 0.2s ease",
                                                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.06)",
                                            }}>
                                                {favorites.some(f => f._id === cafe._id)
                                                    ? "favorite"
                                                    : "favorite_border"}
                                            </span>
                                        </button>

                                        <Link
                                            to={`/cafes/${cafe._id}`}
                                            className="cafe-options-icon"
                                            title="Ver detalles"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <span className="material-symbols-outlined">
                                                arrow_outward
                                            </span>
                                        </Link>
                                    </div>

                                    <img
                                        src={cafe.coverImage || cafe.gallery?.[0] || "/default-cafe.jpg"}
                                        alt={cafe.name}
                                        onError={e => {
                                            e.target.src = "/default-cafe.jpg";
                                        }}
                                    />
                                    <div className="cafe-info">
                                        <h4>{cafe.name}</h4>
                                        <p className="cafe-desc">{cafe.description}</p>
                                        <div className="cafe-rating">
                                            {renderStars(cafe.averageRating)}
                                            <span className="rating-number">
                                                {cafe.averageRating?.toFixed(1) || "0.0"}{" "}
                                                {cafe.reviewsCount > 0 && `(${cafe.reviewsCount})`}
                                            </span>
                                        </div>
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
                <Footer />
            </>
        </div>
    );
}
