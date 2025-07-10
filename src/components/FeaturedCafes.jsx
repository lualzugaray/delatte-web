import { useEffect, useState } from "react";
import "../styles/featuredCafes.css";
import axios from "axios";

export default function FeaturedCafes() {
    const [cafes, setCafes] = useState([]);

    useEffect(() => {
        const fetchCafes = async () => {
            try {
                const res = await axios.get("/api/cafes?limit=3");
                const data = res.data;

                if (Array.isArray(data)) {
                    setCafes(data);
                } else {
                    console.error("Expected array but got:", data);
                    setCafes([]);
                }
            } catch (err) {
                console.error("Error fetching cafes:", err);
            }
        };

        fetchCafes();
    }, []);

    return (
        <section className="featured-cafes">
            <h3>
                <span className="brown">cafeterías</span> destacadas ★
            </h3>
            <p className="subtitle">(las más queridas por la comunidad)</p>

            <div className="cafes-grid">
                {cafes.map((cafe) => (
                    <div className="cafe-card" key={cafe._id}>
                        <img
                            src={cafe.gallery?.[0] || "/default-cafe.jpg"}
                            alt={cafe.name}
                            className="cafe-img"
                        />
                        <h4>{cafe.name}</h4>
                        <p className="desc">{cafe.description?.slice(0, 60) || " "}</p>
                        <div className="stars">
                            {"★".repeat(Math.round(cafe.averageRating || 0))}
                            {"☆".repeat(5 - Math.round(cafe.averageRating || 0))}
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
