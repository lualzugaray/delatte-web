import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/map.css";
import L from "leaflet";

const cafeIcon = L.divIcon({
    className: "custom-marker-icon",
    html: `<span class="material-symbols-outlined">local_cafe</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});

const renderStars = (averageRating = 0) => {
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.25 && averageRating % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const stars = [];

    for (let i = 0; i < fullStars; i++) stars.push("star");
    if (hasHalfStar) stars.push("star_half");
    for (let i = 0; i < emptyStars; i++) stars.push("star_border");

    return stars.map((icon, i) => (
        <span key={i} className="material-icons" style={{ fontSize: "18px", color: "#b47940" }}>
            {icon}
        </span>
    ));
};

export default function Map() {
    const [cafes, setCafes] = useState([]);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/cafes`)
            .then((res) => setCafes(res.data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="home">
            <>
                <Navbar />
                <div className="map-container">
                    <MapContainer center={[-34.9011, -56.1645]} zoom={13} scrollWheelZoom={true}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {cafes.map((cafe) => (
                            cafe.location?.lat && cafe.location?.lng && (
                                <Marker
                                    key={cafe._id}
                                    position={[cafe.location.lat, cafe.location.lng]}
                                    icon={cafeIcon}
                                >
                                    <Popup maxWidth={250}>
                                        <div style={{ textAlign: "center" }}>
                                            <img
                                                src={cafe.coverImage || cafe.gallery?.[0] || "/default-cafe.jpg"}
                                                alt={cafe.name}
                                                style={{
                                                    width: "100%",
                                                    height: "120px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    marginBottom: "8px",
                                                }}
                                                onError={(e) => { e.target.src = "/default-cafe.jpg"; }}
                                            />
                                            <strong style={{ fontSize: "15px", color: "#6B4226" }}>{cafe.name}</strong>
                                            <br />
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2px", margin: "4px 0" }}>
                                                {renderStars(cafe.averageRating)}
                                            </div>

                                            <Link
                                                to={`/cafes/${cafe._id}`}
                                                style={{
                                                    display: "inline-block",
                                                    marginTop: "4px",
                                                    fontSize: "14px",
                                                    color: "#3d1f0f",
                                                    textDecoration: "underline",
                                                }}
                                            >
                                                Ver más →
                                            </Link>
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        ))}
                    </MapContainer>
                </div>
            </>
        </div>
    );
}
