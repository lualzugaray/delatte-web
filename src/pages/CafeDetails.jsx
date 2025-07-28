import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/cafeDetails.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ReviewForm from "../components/ReviewForm";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { FaInstagram, FaTwitter, FaLink } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const libraries = ["places"];

export default function CafeDetails() {
    const { cafeId } = useParams();
    const [cafe, setCafe] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [hoveredUser, setHoveredUser] = useState(null);
    const [userCardPosition, setUserCardPosition] = useState({ x: 0, y: 0 });

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
        libraries: libraries,
    });

    useEffect(() => {
        if (cafeId) loadReviews();
    }, [cafeId]);
    

    useEffect(() => {
        if (cafeId) {
            axios.get(`${import.meta.env.VITE_API_URL}/reviews?cafeId=${cafeId}`)
                .then(res => setReviews(res.data))
                .catch(err => console.error(err));
        }
    }, [cafeId]);

    let leaveTimeout;
    const handleMouseEnter = async (userId, e) => {
        clearTimeout(leaveTimeout);

        const rect = e.target.getBoundingClientRect();

        const x = rect.left + window.scrollX;
        const y = rect.top + window.scrollY;

        setUserCardPosition({
            x: rect.left + 10,
            y: rect.top + 25
        });

        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/clients/${userId}`);
            setHoveredUser(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleMouseEnterAbsolute = async (userId, e) => {
        clearTimeout(leaveTimeout);

        const rect = e.target.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        setUserCardPosition({
            x: rect.left + scrollX + 10,
            y: rect.top + scrollY + 25
        });

        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/clients/${userId}`);
            setHoveredUser(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadReviews = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/reviews?cafeId=${cafeId}`);
            setReviews(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    

    const handleMouseLeave = () => {
        leaveTimeout = setTimeout(() => setHoveredUser(null), 200);
    };

    if (!cafe) return <div className="spinner" />;

    return (
        <div className="cafe-details">
            <Navbar />

            <div className="gallery-box">
                <Swiper
                    slidesPerView={3}
                    spaceBetween={10}
                    navigation
                    modules={[Navigation]}
                    className="gallery-swiper"
                >
                    {cafe.gallery?.map((img, idx) => (
                        <SwiperSlide key={idx}>
                            <img
                                src={img}
                                alt={`img-${idx}`}
                                className="gallery-img-carousel"
                                onError={(e) => e.target.src = "/default-cafe.jpg"}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {selectedImage && (
                    <div className="image-modal-overlay" onClick={() => setSelectedImage(null)}>
                        <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                            <img src={selectedImage} alt="Ampliada" className="modal-full-img" />
                            <button className="closeModal" onClick={() => setSelectedImage(null)}>✕</button>
                        </div>
                    </div>
                )}
            </div>

            <header className="cafe-header">
                <div className="cafe-title">
                    <h1>{cafe.name}</h1>
                    <p className="location">📍 {cafe.address}</p>
                    <p className="manager-info">Subido por un manager 🧑‍💼</p>
                </div>
            </header>

            <section className="cafe-content">
                <div className="aligned-box">
                    <div className="description-box">
                        <h2>Sobre este café</h2>
                        <p>{cafe.description}</p>
                        <div className="cafe-categories">
                            {cafe.categories.map((category) => (
                                <span key={category._id} className="tag">{category.name}</span>
                            ))}
                        </div>

                        <ul className="schedule-list">
                            {Object.entries(cafe.schedule).map(([day, info]) => {
                                const isClosedDay = info.isClosed || !info.open || !info.close;
                                const text = isClosedDay
                                    ? "Cerrado"
                                    : `${info.open} - ${info.close}`;

                                return (
                                    <li key={day}>
                                        <strong>{day}:</strong> {text}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="review-form-box">
                        <h2>Dejá tu reseña</h2>
                        <ReviewForm cafeId={cafeId} onReviewSent={loadReviews} />
                    </div>
                </div>

                <div className="google-map">
                    <h2>Ubicación</h2>
                    {isLoaded && cafe.location?.lat && cafe.location?.lng && (
                        <GoogleMap
                            mapContainerStyle={{ width: "100%", height: "300px", borderRadius: "10px" }}
                            center={{ lat: cafe.location.lat, lng: cafe.location.lng }}
                            zoom={15}
                        >
                            <Marker
                                position={{ lat: cafe.location.lat, lng: cafe.location.lng }}
                                label={cafe.name}
                            />
                        </GoogleMap>
                    )}
                </div>

                <div className="reviews-list">
                    <h2 style={{ textAlign: "center" }}>Reseñas</h2>
                    {reviews.length === 0 ? (
                        <p className="no-reviews">Todavía no hay reseñas.</p>
                    ) : (
                        reviews.map((rev, idx) => (
                            <div className="review-card" key={idx}>
                                {rev.image && <img src={rev.image} alt="reseña" className="review-img" />}
                                <div className="review-rating">⭐ {rev.rating}/5</div>
                                <div className="review-comment">{rev.comment}</div>
                                <span
                                    onMouseEnter={(e) => handleMouseEnter(rev.clientId?._id, e)}
                                    onMouseLeave={handleMouseLeave}
                                    style={{ color: "#96613B", cursor: "pointer" }}
                                >
                                    – {rev.clientId?.firstName || "Usuario"}
                                </span>
                                {rev.categories?.length > 0 && (
                                    <div className="review-tags">
                                        {rev.categories.map(cat => (
                                            <span key={cat._id} className="tag">{cat.name}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                    {hoveredUser && (
                        <div
                            className="user-hover-card"
                            style={{
                                position: "fixed",
                                top: userCardPosition.y,
                                left: userCardPosition.x,
                                zIndex: 999999,
                            }}
                            onMouseEnter={() => clearTimeout(leaveTimeout)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <h4>{hoveredUser.firstName} {hoveredUser.lastName}</h4>
                            <p>{hoveredUser.bio || "Sin biografía."}</p>
                            <div className="user-links">
                                {Object.entries(hoveredUser.socialLinks || {}).map(([platform, link]) =>
                                    link && (
                                        <a key={platform} href={link} target="_blank" rel="noopener noreferrer">
                                            {platform === "instagram" && <FaInstagram style={{ marginRight: "4px" }} />}
                                            {platform === "twitter" && <FaTwitter style={{ marginRight: "4px" }} />}
                                            {platform !== "instagram" && platform !== "twitter" && <FaLink style={{ marginRight: "4px" }} />}
                                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                        </a>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </section >
            <ToastContainer position="top-center" autoClose={3000} />
            <Footer />
        </div >
    );
}
