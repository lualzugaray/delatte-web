import { useEffect, useState } from "react";
import "../styles/featuredCafes.css";
import axios from "axios";

export default function FeaturedCafes() {
    const [cafes, setCafes] = useState([]);

    useEffect(() => {
        const fetchCafes = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/cafes?sortBy=rating&limit=3`);
                const data = res.data;

                if (Array.isArray(data)) {
                    setCafes(data);
                } else {
                    console.error(data);
                    setCafes([]);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchCafes();
    }, []);

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
        <section className="featured-cafes">
            <h3>
                <span className="brown">cafeterías</span> destacadas ★
            </h3>
            <p className="subtitle">(las más queridas por la comunidad)</p>

            <div className="cafes-grid">
                {cafes.map((cafe) => (
                    <div className="cafe-card" key={cafe._id}>
                        <div className="cafe-options-wrapper">
                            <Link
                                to={`/cafes/${cafe._id}`}
                                className="cafe-options-icon"
                                title="Ver detalles"
                            >
                                <span className="material-symbols-outlined">arrow_outward</span>
                            </Link>
                        </div>
                        <img
                            src={cafe.coverImage || cafe.gallery?.[0] || "/default-cafe.jpg"}
                            alt={cafe.name}
                            onError={(e) => {
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

            {cafes.length === 0 && (
                <p className="empty-message">Aún no hay cafeterías destacadas cargadas ☕️</p>
            )}

        </section>
    );
}
