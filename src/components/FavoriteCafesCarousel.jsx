import React from "react";
import { Link } from "react-router-dom";
import "../styles/profile.css"; 
import "../styles/explore.css";

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

const FavoriteCafesCarousel = ({ cafes, favorites, handleFavoriteToggle }) => {
  return (
      <div className="explore-grid">
        {cafes.map((cafe) => (
          <div
            className="cafe-card"
            key={cafe._id}
            onClick={(e) => e.stopPropagation()} // Prevent onClick from triggering on the whole card
          >
            <div className="cafe-options-wrapper">
              <button
                className={`favorite-btn ${favorites.some((f) => f._id === cafe._id) ? "favorited" : ""}`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click propagation
                  handleFavoriteToggle(cafe._id); // Toggle favorite
                }}
              >
                <span
                  className="material-icons"
                  style={{
                      color: "#6B4226;",
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
                  }}
            
                >
                  {favorites.some((f) => f._id === cafe._id) ? "favorite" : "favorite_border"}
                </span>
              </button>

              <Link
                to={`/cafes/${cafe._id}`}
                className="cafe-options-icon"
                title="Ver detalles"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="material-symbols-outlined">
                  arrow_outward
                </span>
              </Link>
            </div>

            <img
              src={cafe.coverImage || "/default-cafe.jpg"} 
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
  );
};

export default FavoriteCafesCarousel;
